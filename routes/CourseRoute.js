const express = require("express");
const router = express.Router();

// Controllers
const { createCourse, getAllCourses, getCourseDetails } = require("../controllers/CourseController");
const { createCategory, getAllCategories, categoryPageDetails } = require("../controllers/CategoryController");
const { createSection, updateSection, deleteSection } = require("../controllers/SectionController");
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSectionController");
const { createRating, getAverageRating, getAllRating } = require("../controllers/RatingAndReviewController");

// Middlewares
const { auth, checkRole } = require("../middlewares/authMiddleware");

// ********************************************************************************************************
//                                      Course Routes (Only for Instructors)
// ********************************************************************************************************
router.post("/createCourse", auth, checkRole("instructor"), createCourse);
router.post("/addSection", auth, checkRole("instructor"), createSection);
router.post("/updateSection", auth, checkRole("instructor"), updateSection);
router.post("/deleteSection", auth, checkRole("instructor"), deleteSection);
router.post("/addSubSection", auth, checkRole("instructor"), createSubSection);
router.post("/updateSubSection", auth, checkRole("instructor"), updateSubSection);
router.post("/deleteSubSection", auth, checkRole("instructor"), deleteSubSection);

// ********************************************************************************************************
//                                      General Course Routes (Public)
// ********************************************************************************************************
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);

// ********************************************************************************************************
//                                      Category Routes (Admin Only)
// ********************************************************************************************************
router.post("/createCategory", auth, checkRole("admin"), createCategory);
router.get("/showAllCategories", getAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, checkRole("student"), createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;

// File name: CourseRoute.js