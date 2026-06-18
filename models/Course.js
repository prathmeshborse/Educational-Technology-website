const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {type: String, required: true},
    courseDescription: {type: String, trim: true},
    price: {type: Number, required: true},
    thumbnailUrl: {type: String, required: true},
    thumbnailPublicId: {type: String, required: true},
    whatYouWillLearn: {type: String},
    tags: {type: [String]},
    
    status: {type: String, enum:["Draft", "Published"]},
    
    instructor: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},


    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }],

    ratingsAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },

    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);

// File name: Course.js