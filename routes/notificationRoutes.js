// routes/notifications.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/notificationController");

router.get("/:receiverId",  controller.list);
router.post("/", controller.create);
router.patch("/:id/read",authMiddleware, controller.markOneRead);
router.patch("/read-all", authMiddleware,controller.markAllRead);
router.delete("/:id", controller.remove);

module.exports = router;
