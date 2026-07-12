Full-Stack E-Learning Platform

A responsive, multi-role e-learning web application built using the MERN stack
(MongoDB, Express.js, React, Node.js). The platform provides a structured
environment where instructors can build and manage educational courses, and
students can browse catalog categories, manage a shopping cart, and enroll in
courses.

Features

1. Authentication & Security

  - Role-Based Access: Distinct portals and permissions for Students and
    Instructors.
  - OTP-Based Verification: Secure registration using email-based One-Time
    Passwords (OTP).
  - Authorized Sessions: Secure login powered by JSON Web Tokens (JWT) stored in
    HTTP-only cookies.
  - Account Recovery: Password reset flow using secure, tokenized links sent via
    email.

2. Instructor Features

  - Course Creation Wizard: Step-by-step form to input course descriptions,
    requirements, tags, and thumbnails.
  - Dynamic Course Builder: Drag-and-drop-style builder to organize content into
    Sections and Sub-sections (lectures).
  - Media Management: Upload course thumbnails and lecture videos securely to
    cloud storage.
  - Course Status Control: Save courses as drafts or publish them to make them
    visible in the student catalog.

3. Student Features

  - Course Catalog: Browse published courses organized by academic categories.
  - Shopping Cart: Add, review, and remove courses from a persistent shopping
    cart.
  - Course Enrollment: Enroll in selected courses to gain access to educational
    material.
  - Enrolled Courses Dashboard: View enrolled courses and track academic
    progress.

4. Profile & Account Settings

  - Information Updates: Edit personal details, biography, date of birth, and
    contact information.
  - Profile Picture Management: Upload and update profile avatars.
  - Security Settings: Change account passwords inside the authenticated
    dashboard.
  - Account Deletion: Request permanent account deletion.

5. Support

  - Contact Us Portal: Functional contact form that handles user inquiries and
    forwards them to administration via email.

Tech Stack

Frontend

  - Core: React 19, React Router DOM (v7)
  - State Management: Redux Toolkit, React-Redux
  - Styling: Tailwind CSS, React Icons
  - Forms & Feedback: React Hook Form, React Hot Toast
  - UI Components: Swiper (for sliders), React OTP Input

Backend

  - Runtime & Framework: Node.js, Express.js (v5)
  - Database: MongoDB, Mongoose (v9)
  - Authentication: JWT, Bcryptjs, OTP Generator
  - File Uploads: Express Fileupload, Cloudinary SDK
  - Mail Delivery: Nodemailer

Getting Started

Prerequisites

  - Node.js installed on your machine.
  - A MongoDB Atlas database or local MongoDB instance.
  - A Cloudinary account for managing media uploads.

Installation

1.  Clone the repository and navigate to the project root:

    git clone <repository-url>
    cd Educational-Technology-website-main

2.  Install all dependencies for the root, frontend, and backend simultaneously:

    npm run install-all

Configuration

Create a .env file in the BACKEND directory and populate it with your
credentials:

PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Email Configuration
MAIL_HOST=your_smtp_host
MAIL_USER=your_smtp_email
MAIL_PASS=your_smtp_password

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

Running the Application

To start both the backend server and the frontend client concurrently, run the
following command from the root directory:

npm run dev

  - Frontend: runs on http://localhost:5173
  - Backend: runs on http://localhost:4000
 
