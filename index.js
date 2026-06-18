const express = require("express");
const app = express();

// Import Routes
const userRoutes = require("./routes/UserRoute");
const profileRoutes = require("./routes/ProfileRoute");
const paymentRoutes = require("./routes/PaymentsRoute");
const courseRoutes = require("./routes/CourseRoute");
const contactUsRoute = require("./routes/ContactRoute");

// Import Configurations
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

// 1. Database Connection
connectDB();

// 2. Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);

// Middleware for file upload
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

// 3. Cloudinary Connection
cloudinaryConnect();

// 4. Routes Mounting
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);


// 5. Default Route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running...",
    });
});


// 6. Activate Server
app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});