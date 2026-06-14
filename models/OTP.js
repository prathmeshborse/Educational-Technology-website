const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../email_template/otpTemplate");

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { 
        type: Date,
        default: Date.now, // Removed ()
        expires: 5 * 60 // 5 minutes
    },
});


// async funciton to send email.
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification email from Edtech", otpTemplate(otp));
        console.log("Email sent successfully!", mailResponse);
    }
    catch(error){
        console.log("Error While sending mail for otp verification: ", error);
        throw error;
    }
};

// pre Save middleware befor saving otp in db
otpSchema.pre('save', async function(next){
    try {
        // 'this' refers to the current document being saved
        await sendVerificationEmail(this.email, this.otp);
        next(); // Move to the next middleware or save the doc
    } catch (error) {
        // If email fails, the document will NOT be saved
        next(error); 
    }
});

//If sendVerificationEmail throws an error and you pass it into next(error), Mongoose will stop the saving process.
//This prevents "orphaned" OTPs in your database where a user has a code saved in the DB but never actually received the email.

module.exports = mongoose.model("OTP", otpSchema);