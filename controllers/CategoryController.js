const Category = require("../models/Category");
const Course = require("../models/Course");

// create new Category
exports.createCategory = async (req, res) => {
    try {
        const {name, description} = req.body;
        if(!name || !description)
            return res.status(401).json({success: false, message: "All fileds are required"});

        const newCategory = await Category.create({name: name, description: description});

        return res.status(200).json({
            success: true,
            message: `Category created for ${name}`,
            newCategory,
        });
    } 
    catch (error) {
        console.log("Error in createCategory: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// get all Categories
exports.getAllCategories = async (req, res) => {
    try {
        // This will give you the category details AND the list of courses inside them
        const categories = await Category.find({}, {name: true, description: true}).populate("courses");

        return res.status(200).json({
            success: true,
            data: categories
        });
    } 
    catch (error) {
        console.log("Error in getAllCategory: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Category Page Details
exports.categoryPageDetails = async (req, res) => {
    try {
        const {categoryId} = req.body;

        // 1. Get courses for the selected category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" }, // Only show published courses
                populate: "instructor",
            }).exec();

        if (!selectedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Handle case where category exists but has no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.");
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            });
        }


        // 2. Get courses from DIFFERENT categories (Recommendations)
        // We find categories that are NOT the current one
        const categoriesExceptSelected = await Category.find({_id: { $ne: categoryId },});
        
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[Math.floor(Math.random() * categoriesExceptSelected.length)]._id
        )
        .populate({
            path: "courses",
            match: { status: "Published" },
        }).exec();


        // 3. Get TOP SELLING courses across the whole platform
        // We use aggregation to count the size of the studentsEnrolled array
        const mostSellingCourses = await Course.aggregate([
            {
                $match: { status: "Published" } 
            },
            {
                // 1. JOIN with the Users collection
                $lookup: {
                    from: "users",             // The name of the collection in MongoDB (usually lowercase plural)
                    localField: "instructor",   // The field in Course schema
                    foreignField: "_id",        // The field in User schema
                    as: "instructorDetails",    // The temporary name for the joined data
                },
            },
            {
                // 2. CONVERT array to object 
                // $lookup returns an array (e.g., [instructor]), $unwind makes it a single object
                $unwind: "$instructorDetails"
            },
            {
                // 3. PROJECT (Reshape the output)
                $project: {
                    courseName: 1,
                    price: 1,
                    thumbnailUrl: 1,
                    // Pick exactly which instructor fields you want to show
                    instructor: {
                        firstName: "$instructorDetails.firstName",
                        lastName: "$instructorDetails.lastName",
                        email: "$instructorDetails.email",
                    },
                    enrollmentCount: { $size: "$studentsEnrolled" },
                },
            },
            {
                $sort: { enrollmentCount: -1 },
            },
            {
                $limit: 10,
            },
        ]);

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    } 
    catch (error) {
        console.log("Error in categoryPageDetails: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// File Name: CategoryController.js