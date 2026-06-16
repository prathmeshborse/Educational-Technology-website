const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try {
        const {sectionName, courseId} = req.body;
        if(!sectionName || !courseId)
            return es.status(400).json({success: false, message: "all fields are required"});

        const course = await Course.findById(courseId);

        if(!course)
            return es.status(400).json({success: false, message: "No course with give course id"});

        const newSection = await Section.create({sectionName: sectionName});
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
                         {$addToSet: {courseContent: newSection._id}}, {new: true}).populate("courseContent").exec();

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
            return es.status(400).json({success: false, message: "all fields are required"});

        const section = await Section.findByIdAndUpdate(sectionId, {sectionName: sectionName}, {new: true});

        if(!section)
            return es.status(400).json({success: false, message: "Section dose not found"});

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
        const {sectionId} = req.body;
        if(!sectionId)
            return es.status(400).json({success: false, message: "all fields are required"});

        const section = await Section.findByIdAndDelete(sectionId);

        if(!section)
            return es.status(400).json({success: false, message: "Section dose not found"});

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section
        });
    } 
    catch (error) {
        console.log("Error in deleteSection: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
