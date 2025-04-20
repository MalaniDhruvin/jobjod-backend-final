const express = require("express");
const router = express.Router();
const {
  createEducation,
  // getAllEducation,
  updateEducation,
  deleteEducation,
  getEducationForLoggedInUser,
} = require("../controllers/educationController");
const authMiddleware = require("../middleware/authMiddleware"); // Use the authentication middleware

// All education routes are protected by authentication
router.post("/", authMiddleware, createEducation); // Create Education (requires login)
router.get("/:userId", authMiddleware, getEducationForLoggedInUser); // Get all Education records (requires login)
router.put("/:id", authMiddleware, updateEducation); // Update Education (requires login)
router.delete("/:id", authMiddleware, deleteEducation); // Delete Education (requires login)

module.exports = router;
