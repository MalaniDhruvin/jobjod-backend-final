const express = require("express");
const router = express.Router();
const {
  createSkills,
  createSkill,
  getAllSkills,
  getSpecificData,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const authMiddleware = require("../middleware/authMiddleware"); // Use the authentication middleware

// All skill routes are protected by authentication
router.post("/all", authMiddleware, createSkills); // Create Skill (requires login)
router.post("/", authMiddleware, createSkill); // Create Skill (requires login)
router.get("/", authMiddleware, getAllSkills); // Get all Skills (requires login)
router.get("/:userId", getSpecificData); // GET user data
router.put("/:id", authMiddleware, updateSkill); // Update Skill (requires login)
router.delete("/:id", authMiddleware, deleteSkill); // Delete Skill (requires login)

module.exports = router;
