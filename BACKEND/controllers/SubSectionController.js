const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadToCloudinary } = require("../utils/imageUpload");
const cloudinary = require("cloudinary").v2;

// Create Subsection
exports.createSubSection = async (req, res) => {
    try {
        const {sectionId, title, description} = req.body;

        if(!sectionId || !title || !description || !req.files || !req.files.videoFile)
            return res.status(401).json({success: false, message: "All fileds are required"});

        const video = req.files.videoFile;

        // Find if section exists or not
        const section = await Section.findById(sectionId);
        if(!section)
            return res.status(404).json({success: false, message: "No section Found with given id"});
        
        // upload video file to cloudinary
        const cloudinaryResponse = await uploadToCloudinary(video, process.env.FOLDER_NAME);

        // create new subsection
        const newSubsection = await SubSection.create({
            title,
            timeDuration: `${cloudinaryResponse.duration}s`, 
            description,
            videoUrl: cloudinaryResponse.secure_url,
            videoPublicId: cloudinaryResponse.public_id,
        });

        
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
             {$addToSet: {subSection: newSubsection._id}}, {new: true}).populate("subSection").exec();

        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            updatedSection
        });
    } 
    catch (error) {
        console.log("Error in createSubSection: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update Subsection
exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, title, description, sectionId } = req.body;
        
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({ success: false, message: "Subsection not found" });
        }

        // Handle Title Update
        if (title !== undefined) subSection.title = title;
        // Handle Description Update
        if (description !== undefined) subSection.description = description;

        // Handle Video Update
        if (req.files && req.files.videoFile) {
            // 1. Delete the OLD video from Cloudinary first
            if (subSection.videoPublicId) {
                await cloudinary.uploader.destroy(subSection.videoPublicId, { resource_type: "video" });
            }

            const video = req.files.videoFile;
            const uploadDetails = await uploadToCloudinary(video, process.env.FOLDER_NAME, null, null, null, "video");

            // 3. Save the new URL and new Public ID
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.videoPublicId = uploadDetails.public_id; // Save this for next time!
            subSection.timeDuration = `${uploadDetails.duration}s`;
        }

        await subSection.save();
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            data: updatedSection
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Delete subsection
exports.deleteSubSection = async (req, res) => {
    try {
        const {sectionId, subSectionId} = req.body;

        // 1. validation
        if(!subSectionId || !sectionId)
            return res.status(401).json({success: false, message: "subsection-id or section-id is missing"});

        // 2. Find the subsection to get the Public ID
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) return res.status(404).json({ success: false, message: "Not found" });

        // 3. DELETE VIDEO FROM CLOUDINARY
        if (subSection.videoPublicId) {
            await cloudinary.uploader.destroy(subSection.videoPublicId, { resource_type: "video" });
        }

        // 4. DELETE SUB-SECTIONS 
        await SubSection.findByIdAndDelete(subSectionId);

        // 5. DELETE THE subsection entry from section
        await Section.findByIdAndUpdate(sectionId, {$pull: {subSection: subSectionId}});

        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
        });

    } catch (error) {
        console.log("Error in deleteSubSection: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// File name: SubSectionController.js