const express = require("express")
const router = express.Router()
const { contactUs } = require("../controllers/ContactUsController")

router.post("/contact", contactUs);

module.exports = router;

// File name: ContactRoute.js