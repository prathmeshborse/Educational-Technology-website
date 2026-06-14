const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const resetPasswordTemplate = require("../email_template/resetPasswordTemplate");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto"); // Fixed: Added missing import
require("dotenv").config();

// reset password token generation
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ success: false, message: "Email is required"});

        // 2. Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            // Security: Don't tell the user the email doesn't exist.
            // This prevents "Account Enumeration" attacks.
            return res.status(200).json({
                success: true,
                message: "If an account with that email exists, we have sent a reset link.",
            });
        }

        const token = crypto.randomUUID();
        
        // 5 minutes might be a bit short for some email providers.
        await User.findOneAndUpdate({ email: email },
                                    { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
                                    { new: true }
        );

        // 4. Create URL (Using Env Variable)
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const url = `${frontendUrl}/reset-password/${token}`;

        // 5. Send Mail
        await mailSender(email, "Password Reset Link", resetPasswordTemplate(url));

        return res.status(200).json({
            success: true,
            message: "Password reset link sent successfully",
        });

    } catch (error) {
        console.error("RESET PASSWORD TOKEN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the reset mail",
        });
    }
};


// reset password
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        // 1. Validation
        if (!password || !confirmPassword || !token)
            return res.status(400).json({ success: false, message: "All fields are required" });

        if (password !== confirmPassword)
            return res.status(400).json({ success: false, message: "Passwords do not match" });

        // 2. Find user by token
        const user = await User.findOne({ token: token });
        if (!user)
            return res.status(400).json({ success: false, message: "Invalid reset link" });

        // 3. Check Expiry
        if (user.resetPasswordExpires < Date.now())
            return res.status(400).json({ success: false, message: "Reset link has expired. Please request a new one." });

        // 4. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Update user AND clear the reset fields
        user.password = hashedPassword;
        user.token = undefined; // Clears the token so it can't be used again
        user.resetPasswordExpires = undefined; // Clears the expiry
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully. You can now log in."
        });

    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during password reset",
        });
    }
};