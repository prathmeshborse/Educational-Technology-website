const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// Create Rating
exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const {rating, review, courseId} = req.body;

        if(!courseId || (!rating && !review))
            return res.status(400).json({success: false, message:"Some fields are missing"});

        // const course = await Course.findOne({_id: courseId, studentsEnrolled: {$elemMatch: {$eq: userId}}});

        const course = await Course.findById(courseId);

        // Use .some() to compare string versions of the IDs
        const isEnrolled = course?.studentsEnrolled.some( (id) => id.toString() === userId );

        if(!course || !isEnrolled) {
            return res.status(403).json({ 
                success: false, 
                message: "User is not enrolled in this course" 
            });
        }

        // DUPLICATE CHECK
        const alreadyReviewed = await RatingAndReview.findOne({user: userId, course: courseId});
        if(alreadyReviewed)
            return res.status(403).json({ success: false, message: "Course already reviewed by user" });

        // Create rating and review
        const ratingReview = await RatingAndReview.create({user: userId, rating: rating, review: review, course: courseId});

        // Add rating in course
        await Course.findByIdAndUpdate(courseId, { $addToSet: { ratingsAndReviews: ratingReview._id } });

        return res.status(200).json({
            success: true,
            message: "Course rated successfully",
            data: ratingReview
        });
    } 
    catch (error) {
        console.log("Error in createRating: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Average Rating
exports.getAverageRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const {courseId} = req.body;

        if(!courseId)
            return res.status(400).json({success: false, message:"Course id missing"});

        // Calculating avg rating
        const result = await RatingAndReview.aggregate([
            {
                // match all rating and review for given courseId
                $match:{ course: new mongoose.Types.ObjectId(courseId) },
            },
            {
                $group:{ _id:null, averageRating: {$avg: "$rating"} },
            },
            // can also add sort
        ]);

        return res.status(200).json({
            success: true,
            message: "Average rating calculated successfully",
            averageRating: `${(result.length > 0)? result[0].averageRating.toFixed(1): 0}`,
        });
    } 
    catch (error) {
        console.log("Error in getAverageRating: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get All Rating
exports.getAllRating = async (req, res) => {
    try {
        const result = await RatingAndReview.find({}).sort({rating: "desc"})
            .populate({
                path: "user",
                select: "firstName lastName email additionalDetails",

                populate: {
                    path: "additionalDetails",
                    select: "imageURL",
                }
            })
            .populate({
                path: "course",
                select: "courseName"
            }).exec();

        return res.status(200).json({
            success: true,
            message: "All Rating review fetched successfully",
            data: result,
        });
    } 
    catch (error) {
        console.log("Error in getAllRating: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// File name: RatingAndReviewController.js