// controllers/notificationController.js

const { Op } = require("sequelize");
const Notification = require("../models/notificationModel");

// GET   /notifications
// List all notifications for the current user
exports.list = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const notifications = await Notification.findAll({
      where: { receiverId },
      order: [["createdAt", "DESC"]],
    });
    res.json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// POST  /notifications
// Create a new notification for a user
// body: { receiverId, message }
exports.create = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ message: "receiverId & message are required" });
    }

    const existingNotification = await Notification.findOne({
      where: { message, receiverId },
    });

    if (existingNotification) {
      return res
        .status(200)
        .json({
          message: "Notification already exists",
          notification: existingNotification,
        });
    }
    
    const notification = await Notification.create({
      receiverId,
      message,
    });
    res.status(201).json({ notification });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ message: "Failed to create notification" });
  }
};

// PATCH /notifications/:id/read
// Mark one notification as read
exports.markOneRead = async (req, res) => {
  try {
    const receiverId = req.userId;
    const { id } = req.params;
    const notif = await Notification.findOne({
      where: { id, receiverId },
    });
    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notif.isRead = true;
    await notif.save();
    res.json({ notification: notif });
  } catch (err) {
    console.error("Error marking notification read:", err);
    res.status(500).json({ message: "Failed to mark notification read" });
  }
};

// PATCH /notifications/read-all
// Mark all notifications for this user as read
exports.markAllRead = async (req, res) => {
  try {
    const receiverId = req.userId;
    await Notification.update(
      { isRead: true },
      {
        where: {
          receiverId,
          isRead: { [Op.not]: true },
        },
      }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all notifications read:", err);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

// DELETE /notifications/:id
// Delete a single notification
exports.remove = async (req, res) => {
  try {
    const receiverId = req.userId;
    const { id } = req.params;
    const deleted = await Notification.destroy({
      where: { id, receiverId },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
