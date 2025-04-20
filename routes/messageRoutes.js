// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// List all 1:1 conversations for a user
// GET /api/users/:userId/conversations
router.get(
  '/:userId/conversations',
  messageController.getConversations
);

// Get full message history between userId and peerId
// GET /api/users/:userId/conversations/:peerId/messages
router.get(
  '/:userId/conversations/:peerId/messages',
  messageController.getConversationMessages
);

// Send a new 1:1 message from userId to peerId
// POST /api/users/:userId/conversations/:peerId/messages
router.post(
  '/:userId/:peerId',
  messageController.sendMessage
);

module.exports = router;
