const User = require("../models/User");
const Profile = require("../models/Profile");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const cloudinary = require("cloudinary").v2;

// Get user details with profile
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await User.findById(userId).populate("additionalDetails").select("-password").exec();

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            userDetails ,
        });
    } 
    catch (error) {
        console.log("Error in getUserDetails: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const {gender, dateOfBirth, about, contactNumber} = req.body;
        const userId = req.user.id;
        
        if(!contactNumber && !gender && !dateOfBirth && !about&& !userId)
            return res.status(400).json({success: false, message: "No data recived to update profile"});
        
        const user = await User.findById(userId);
        const profile = await Profile.findById(user.additionalDetails);

        if (gender) profile.gender = gender;
        if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
        if (about) profile.about = about;
        if (contactNumber) profile.contactNumber = contactNumber;


        await profile.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile,
        });
    } 
    catch (error) {
        console.log("Error in updateProfile: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if(!userId)
            return res.status(400).json({success: false, message: "user-id missing"});
        
        const user = await User.findById(userId);
        if(!user)
            return res.status(400).json({success: false, message: "User dose not exists"});
        
        // 1. Delete user profile
        await Profile.findByIdAndDelete(user.additionalDetails);


        // 2. Fetch all course where user is inrolled.
        const deletionPromises = user.courses.map((courseId) => {
            return Course.findByIdAndUpdate(courseId, { $pull: { studentsEnrolled: userId } });
        });
        await Promise.all(deletionPromises);
        

        // If user is instructor then delete all it's courses including section and subsection
        if (user.accountType === "instructor") {
            // 1. Find all courses by this instructor
            const coursesCreated = await Course.find({ instructor: userId });

            for (const course of coursesCreated) {

                // A. Delete Course Thumbnail from Cloudinary
                if (course.thumbnailPublicId) {
                    await cloudinary.uploader.destroy(course.thumbnailPublicId);
                }

                // 2. We need the sections to find subsections
                const sections = await Section.find({ _id: { $in: course.courseContent } });

                for (const section of sections) {
                    // 3. Delete SubSections (Videos) from DB. We find all SubSections whose IDs
                    const subSections = await SubSection.find({ _id: { $in: section.subSection } });

                    const deletionPromises = subSections.map((sub) => {
                        if (sub.videoPublicId) {
                            return cloudinary.uploader.destroy(sub.videoPublicId, { resource_type: "video" });
                        }
                        return Promise.resolve(); // If no video, just resolve
                    });
                    await Promise.all(deletionPromises);


                    await SubSection.deleteMany({ _id: { $in: section.subSection } });
                }


                // 4. Delete Sections from DB
                await Section.deleteMany({ _id: { $in: course.courseContent } });
            }

            // 5. Finally delete the courses
            await Course.deleteMany({ instructor: userId });
        }

        // 3. Delete user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Account and all associated data deleted successfully"
        });
    } 
    catch (error) {
        console.log("Error in deleteAccount: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};