const Category = require("../models/Category");

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