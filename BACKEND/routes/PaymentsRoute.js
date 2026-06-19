const express = require("express");
const router = express.Router();

const { capturePayment, verifySignature } = require("../controllers/PaymentsController");
const { auth, checkRole } = require("../middlewares/authMiddleware");

router.post("/capturePayment", auth, checkRole("student"), capturePayment);
router.post("/verifySignature", verifySignature); // Note: Razorpay hits this, usually no user auth needed

module.exports = router;

// File name: PaymentRoute.js