const express = require("express");
const router = express.Router();
const {
  createUser,
  getSpecificData,
  getData,
  updateUser,
  deleteUser,
  addApplicant,
  getAppliedFor,
  getAppliedOnByJobId,
  getUsersAppliedForJob,
  updateApplicationStatus
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware"); // Use the authentication middleware

router.post("/register", authMiddleware, createUser);
// router.get("/", authMiddleware, getData); // GET user data
router.get("/:userId", getSpecificData); // GET user data
router.put("/:userId", authMiddleware, updateUser); // PUT update user data
router.delete("/", authMiddleware, deleteUser); // DELETE user account
router.post("/:userId/apply", authMiddleware, addApplicant);
router.get("/appliedFor/:userId", authMiddleware, getAppliedFor);
router.get("/appliedFor/:jobId/apply/:userId", authMiddleware, getAppliedOnByJobId);
router.get("/appliedFor/:jobId/apply", getUsersAppliedForJob);
router.put("/:jobId/apply/:userId/status", updateApplicationStatus);


module.exports = router;
