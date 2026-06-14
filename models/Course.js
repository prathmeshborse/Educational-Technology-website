const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {type: String, required: true},
    courseDescription: {type: String, trim: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    whatYouWillLearn: {type: String},

    instructor: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},


    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    }],

    ratingsAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
        required: true,
    }],

    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    }],

    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }]
});

module.exports = mongoose.model("Course", courseSchema);