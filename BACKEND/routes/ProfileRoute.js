const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/authMiddleware");
const { deleteAccount, updateProfile, getUserDetails } = require("../controllers/ProfileController");

router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getUserDetails);

module.exports = router;

// File name: ProfileRoute.js