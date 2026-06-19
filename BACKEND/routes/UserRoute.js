const express = require("express");
const router = express.Router();

const { login, signUp, sendOTP, changePassword } = require("../controllers/AuthController");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPasswordController");
const { auth } = require("../middlewares/authMiddleware");

// Authentication Routes
router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", sendOTP);
router.post("/changepassword", auth, changePassword);

// Reset Password Routes
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;

// File name: UserRoute.js