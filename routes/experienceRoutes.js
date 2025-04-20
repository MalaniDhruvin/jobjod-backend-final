const express = require("express");
const router = express.Router();
const {
  createExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
  getExperiencesForLoggedInUser,
} = require("../controllers/experienceController");
const authMiddleware = require("../middleware/authMiddleware"); // Use the authentication middleware

// All experience routes are protected by authentication
router.post("/", authMiddleware, createExperience); // Create Experience (requires login)
router.get("/:userId", authMiddleware, getExperiencesForLoggedInUser); // Get Required Experience (requires login)
router.put("/:id", authMiddleware, updateExperience); // Update Experience (requires login)
router.delete("/:id", authMiddleware, deleteExperience); // Delete Experience (requires login)

module.exports = router;
