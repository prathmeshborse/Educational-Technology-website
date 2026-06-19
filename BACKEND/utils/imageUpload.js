const cloudinary = require("cloudinary").v2;

exports.uploadToCloudinary = async (file, folder, height, quality, width, resourceType = "auto") => {
    const options = {
        folder,
        resource_type: resourceType,
    };

    // Only apply height/width transformations if they are passed
    if (height) options.height = height;
    if (width) options.width = width;

    // Apply crop ONLY if we are resizing
    // "fill" is great for images, but for videos, you might prefer "scale" or none at all
    if (height || width) {
        options.crop = "fill"; 
        options.gravity = "auto"; 
    }

    if (quality) {
        options.quality = quality;
    } else {
        options.quality = "auto";
    }

    // Pro-Tip: For large videos, Cloudinary performs better with chunk_size
    if (resourceType === "video") {
        options.chunk_size = 6000000; // 6MB chunks
    }

    return await cloudinary.uploader.upload(
        file.tempFilePath,
        options
    );
};