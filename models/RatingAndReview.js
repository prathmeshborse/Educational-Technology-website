const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // Added min/max
    review: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Good to link back to Course
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);