const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/imageUpload");

exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, categoryId } = req.body;
        
        // 1. Validation
        if (!req.files || !req.files.thumbnailImage)
            return res.status(400).json({ success: false, message: "Thumbnail image is required" });
        
        const thumbnail = req.files.thumbnailImage;
        const instructorId = req.user.id;

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !categoryId)
            return res.status(400).json({ success: false, message: "All fields are required" });

        // 2. Verify Category
        const categoryDetails = await Category.findById(categoryId);
        if (!categoryDetails)
            return res.status(404).json({ success: false, message: "Category not found." });

        // 3. Upload to Cloudinary
        const thumbnailImage = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME, 300, "auto", 300);

        // 4. Create Entry
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorId,
            whatYouWillLearn,
            price: Number(price),
            category: categoryDetails._id,
            thumbnailUrl: thumbnailImage.secure_url,
            thumbnailPublicId: thumbnailImage.public_id,
        });

        // 5. Update Instructor's Course List
        await User.findByIdAndUpdate(instructorId, 
            { $addToSet: { courses: newCourse._id } }, // $push or $addToSet
            { new: true }
        );

        // 6. Update Category's Course List
        categoryDetails.courses.push(newCourse._id);
        await categoryDetails.save();

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        });
    } catch (error) {
        console.error("Error in createCourse: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        // Fetch specific fields + populate instructor details
        const courses = await Course.find({}, 
            {
                courseName: true, 
                price: true, 
                instructor: true, 
                courseDescription: true,
                category: true,
                thumbnailUrl: true, // Don't forget the thumbnail!
                ratingsAndReviews: true, 
                studentsEnrolled: true
            }
        ).populate("instructor").populate("category").exec();
            
        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: courses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};