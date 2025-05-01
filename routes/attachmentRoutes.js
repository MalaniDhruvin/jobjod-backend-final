const express = require("express");
const router = express.Router();
const {
  createOrUpdateProfile,
  getProfile,
  updatePortfolio,
  deleteResume,
  deletePortfolioLink,
  downloadAttachment
} = require("../controllers/attachmentController");

const authMiddleware = require("../middleware/authMiddleware"); // Use the authentication middleware

// Route to create or update profile with resume (file upload) and portfolio links
router.post("/", authMiddleware, createOrUpdateProfile);

// Route to get profile data (resume and portfolio links)
router.get("/:userId", authMiddleware, getProfile);

// Route to update a portfolio link
router.put("/portfolio/:id", authMiddleware, updatePortfolio);

// Route to delete a resume (PDF)
router.delete("/resume/:id", authMiddleware, deleteResume); // DELETE resume by ID

// Route to delete a portfolio link
router.delete("/portfolio/:id", authMiddleware, deletePortfolioLink); // DELETE portfolio link by ID

router.get("/:id/download", downloadAttachment);

module.exports = router;
