const cloudinary = require("cloudinary").v2;

exports.uploadToCloudinary = async (file, folder, height, quality, width, resourceType = "auto") => {
    const options = {
        folder,
        resource_type: resourceType,
    };

    // 1. Set Height and Width
    if (height) options.height = height;
    if (width) options.width = width;

    // 2. Add Crop Mode (Crucial for thumbnails)
    // "fill" resizes and crops to ensure the area is filled
    // "thumb" is specifically designed for thumbnails
    if (height || width) {
        options.crop = "fill"; 
    }

    // 3. Add Gravity (Focus on the center or face)
    // This ensures the most important part of the image isn't cut off
    options.gravity = "auto"; 

    // 4. Quality/Optimization
    if (quality) {
        options.quality = quality;
    } else {
        options.quality = "auto"; // Recommended: automatically balances size/quality
    }

    return await cloudinary.uploader.upload(
        file.tempFilePath,
        options
    );
};