const express = require("express");
const {
  getApplications,
  getApplicationsByUser,
  createApplication,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware"); // Use the authentication middleware

const router = express.Router();

router.get("/",authMiddleware, getApplications);
router.get("/:userId",authMiddleware, getApplicationsByUser);
router.post("/",authMiddleware, createApplication);

module.exports = router;
