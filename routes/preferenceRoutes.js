const express = require("express");
const router = express.Router();
const {
  createPreference,
  getPreferencesForLoggedInUser,
  getAllPreferences,
  updatePreference,
  deletePreference,
} = require("../controllers/preferenceController");
const authMiddleware = require("../middleware/authMiddleware"); // Use the authentication middleware

// All preference routes are protected by authentication
router.post("/", authMiddleware, createPreference); // Create Preference (requires login)
router.get("/:userId", authMiddleware, getPreferencesForLoggedInUser); // Get all Preferences for logged-in user (requires login)
// router.get("/all", authMiddleware, getAllPreferences); // GET user data
router.put("/:id", authMiddleware, updatePreference); // Update Preference (requires login)
router.delete("/:id", authMiddleware, deletePreference); // Delete Preference (requires login)

module.exports = router;
