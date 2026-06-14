const Tag = require("../models/Tag");

// create new tag
exports.createTag = async (req, res) => {
    try {
        const {name, description} = req.body;
        if(!name || !description)
            return res.status(401).json({success: false, message: "All fileds are required"});

        const newTag = await Tag.create({name: name, description: description});

        return res.status(200).json({
            success: true,
            message: `Tag created for ${name}`,
        });
    } 
    catch (error) {
        console.log("Error in createTag: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// get all tags
exports.getTags = async (req, res) => {
    try {
        const tags = await Tag.find({}, {name:true, description: true});

        return res.status(200).json({
            success: true,
            message: "All tags fetched",
            tags: tags
        });
    } 
    catch (error) {
        console.log("Error in createTag: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};