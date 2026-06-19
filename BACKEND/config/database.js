const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () =>{
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Database connected successfully");
    }
    catch(err){
        console.error("Database connection failed", err);
        process.exit(1);
    }
}

module.exports = connectDB;

// File name database.js