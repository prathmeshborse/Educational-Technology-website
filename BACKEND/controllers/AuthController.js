const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const passwordChangedTemplate = require("../email_template/passwordChangedTemplate");
require("dotenv").config();


// send otp
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if(!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already registered",
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        });

        await OTP.deleteMany({ email }); // each email has only one valid OTP at a time and avoids confusion
        await OTP.create({ email, otp });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.error("Error while sending OTP (sendOTP):", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Sign Up API
exports.signUp = async (req, res) => {
    try {
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNo, otp} = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(400).json({
                success: false,
                message: "[firstName, lastName, email, password, confirmPassword] this fields are required"
            });
        }
        
        // Password matching in backend because user can bypass frontend using postman api tool
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }
        
        // Check duplicate email
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "email already exists",
            });
        }

        // OTP verification
        const otpDoc = await OTP.findOne({email, otp,});

        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        // Delete otp after successful verification
        await OTP.deleteMany({ email });

        
        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile for user
        const profile = await Profile.create({
            gender:null, dateOfBirth: null, about: null, contactNumber:contactNo? contactNo: null,
            imageURL: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`,
        });
        

        // User Creation
        const user = await User.create({
            firstName, 
            lastName, 
            email, 
            accountType,
            password: hashedPassword, additionalDetails: profile._id 
        });
        
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: userResponse
        });
    } 
    catch (error) {
        console.log("Error in signUp: ", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Login
exports.login = async (req, res) =>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "[email, password] this fields are required"
            });
        }
        
        // Check duplicate email
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "invalid email or password",
            });
        }
        
        // Password matching
        if(await bcrypt.compare(password, existingUser.password)){
            const payload = {
                email: existingUser.email,
                id: existingUser._id,
                accountType: existingUser.accountType
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2h"});

            const userResponse = existingUser.toObject();
            delete userResponse.password;
            userResponse.token = token;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }

            return res.cookie("token", token, options).status(200).json({
                success: true,
                userResponse,
                message: "Logged in successfully"
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "invalid email or password",
            });
        }
    }
    catch(error){
        console.log("Error in login: ", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// Change password
exports.changePassword = async (req, res) => {
    try{
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        const userId = req.user.id;

        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            });
        }
        
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success: false,
                message: "password and confirm-password not matched"
            });
        }

        if(oldPassword === newPassword){
            return res.status(400).json({
                success: false,
                message: "New password must be different from old password",
            });
        }

        // Check duplicate email
        const existingUser = await User.findById(userId);
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "No user with given email",
            });
        }
        
        const isMatch = await bcrypt.compare(oldPassword, existingUser.password.toString());

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();

        // Send mail after successful passwrod change operation
        mailSender(existingUser.email, "Password changed successfully",
                     passwordChangedTemplate(`${existingUser.firstName} ${existingUser.lastName}`));

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch(error){
        console.log("Error in changePassword: ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// File name AuthController.js