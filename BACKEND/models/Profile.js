const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: {type: String},
    dateOfBirth: {type: String},
    imageURL: { type: String, default:""},
    about: {type: String, trim: true},
    contactNumber: {type: String, trim: true},
}, {timestamps: true});

module.exports = mongoose.model("Profile", profileSchema);

// FileName: Profile.js