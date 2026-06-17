const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
const cloudinary = require("cloudinary").v2;

exports.createSection = async (req, res) => {
    try {
        const {sectionName, courseId} = req.body;
        if(!sectionName || !courseId)
            return res.status(400).json({success: false, message: "all fields are required"});

        const course = await Course.findById(courseId);

        if(!course)
            return res.status(400).json({success: false, message: "No course with give course id"});

        const newSection = await Section.create({sectionName: sectionName});
        
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
                         {$addToSet: {courseContent: newSection._id}}, {new: true})
                         .populate({
                            path: "courseContent",
                            populate: {
                                path: "subSection",
                            }
                         }).exec();

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse
        });
    } 
    catch (error) {
        console.log("Error in createSection: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


exports.updateSection = async (req, res) => {
    try {
        const {sectionName, sectionId} = req.body;
        if(!sectionName || !sectionId)
            return res.status(400).json({success: false, message: "all fields are required"});

        const section = await Section.findByIdAndUpdate(sectionId, {sectionName: sectionName}, {new: true});

        if(!section)
            return res.status(400).json({success: false, message: "Section dose not found"});

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section
        });
    } 
    catch (error) {
        console.log("Error in updateSection: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


exports.deleteSection = async (req, res) => {
    try {
        const {sectionId, courseId} = req.body;

        // 1. Find the section to get its subSections list
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        // 2. FETCH ALL SUB-SECTIONS to get their video IDs
        // We find all SubSections whose IDs are in the section.subSection array
        const subSections = await SubSection.find({ _id: { $in: section.subSection } });

        // 3. DELETE VIDEOS FROM CLOUDINARY
        // Use Promise.all to delete all videos in parallel (faster than a loop)
        const deletionPromises = subSections.map((sub) => {
            if (sub.videoPublicId) {
                return cloudinary.uploader.destroy(sub.videoPublicId, { resource_type: "video" });
            }
            return Promise.resolve(); // If no video, just resolve
        });
        await Promise.all(deletionPromises);


        // 4. DELETE ALL SUB-SECTIONS from MongoDB
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        // 5. DELETE THE SECTION itself
        await Section.findByIdAndDelete(sectionId);

        // 6. UPDATE THE COURSE (Remove the section ID from courseContent)
        await Course.findByIdAndUpdate(courseId, {$pull: {courseContent: sectionId}});

        return res.status(200).json({
            success: true,
            message: "Section and its Sub-sections deleted successfully",
        });

    } catch (error) {
        console.log("Error in deleteSection: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};