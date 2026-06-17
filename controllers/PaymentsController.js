const { default: mongoose } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const coursePurchasedTemplate = require("../email_template/coursePurchasedTemplate");


// Order Creating - capturing payment
exports.capturePayment = async (req, res) => {
    try {
        const {courseId} = req.body;
        const userId = req.user.id;

        const course = await Course.findById(courseId);
        if(!course)
            return res.status(404).json({success: false, message: "Course not found"});

        // convert userId(string type) into uid(mongoose object id);
        const uid = new mongoose.Types.ObjectId(userId);

        if(course.studentsEnrolled.includes(uid))
            return res.status(200).json({success: false, message: "Already enrolled in course"});

        const amount = course.price;
        const currency = "INR";
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: `order_rcpt_${Date.now()}`,
            notes: {
                courseId: courseId,
                userId: userId,
            }
        };


        try {
            const paymentResponse = await instance.orders.create(options);
            console.log("Payment Response: ", paymentResponse);

            return res.status(200).json({
                success: true,
                message: "Payment successfully",
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnailUrl,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount
            });
        } 
        catch (error) {
            console.log("Error in capturePayment(order creating): ", error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    } 
    catch (error) {
        console.log("Error in capturePayment: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// verify signature
exports.verifySignature = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "12345678";
        const signature = req.headers["x-razorpay-signature"];

        const shaSum = crypto.createHmac("sha256", webhookSecret);
        shaSum.update(JSON.stringify(req.body));
        const digest = shaSum.digest("hex");

        if (signature !== digest) {
            return res.status(401).json({ success: false, message: "Invalid Signature" });
        }

        // 2. Fetch data from the webhook payload
        const { courseId, userId } = req.body.payload.payment.entity.notes;

        // 3. Perform Database Updates
        const enrolledCourse = await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { studentsEnrolled: userId } },
            { new: true }
        );

        if (!enrolledCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const enrolledStudent = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { courses: courseId } },
            { new: true }
        );

        // 4. Send Confirmation Email
        await mailSender(enrolledStudent.email, "Course Enrollment Successful",
            coursePurchasedTemplate(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                                        process.env.FRONTEND_URL
            )
        );

        return res.status(200).json({
            success: true,
            message: "Payment Authorized & Course Assigned",
        });

    } catch (error) {
        console.error("Webhook Error (verifySignature): ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};