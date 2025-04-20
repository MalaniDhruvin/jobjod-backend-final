// controllers/messageController.js
const { Op } = require("sequelize");
const { Message, User } = require("../config/message.js")

/**
 * GET /api/users/:userId/conversations
 * List all 1:1 "conversations" for the given userId,
 * with last‐message preview.
 */
exports.getConversations = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Fetch all messages involving this user, newest first
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    // Deduplicate by peerId, keeping the most recent message per peer
    const convoMap = new Map();
    for (const msg of messages) {
      const peerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!convoMap.has(peerId)) {
        convoMap.set(peerId, msg);
      }
    }

    const peerIds = Array.from(convoMap.keys());
    // Load peer user info
    const peers = await User.findAll({
      where: { userId: peerIds },
      attributes: ["userId", "fullName"],
    });
    const peerById = Object.fromEntries(peers.map(u => [u.id, u]));

    // Build response
    const result = peerIds.map(peerId => {
      const lastMsg = convoMap.get(peerId);
      return {
        peerId,
        peerInfo: peerById[peerId],
        lastMessage: lastMsg.text,
        lastTimestamp: lastMsg.createdAt,
      };
    });

    return res.json(result);
  } catch (err) {
    console.error("Error loading conversations:", err);
    return res.status(500).json({ error: "Failed to load conversations." });
  }
};

/**
 * GET /api/users/:userId/conversations/:peerId/messages
 * Returns full 1:1 message history between userId and peerId.
 */
exports.getConversationMessages = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const peerId = parseInt(req.params.peerId, 10);
    if (!userId || !peerId) {
      return res.status(400).json({ error: "Invalid IDs." });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: peerId },
          { senderId: peerId, receiverId: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["userId", "fullName"],
        },
      ],
    });

    const payload = messages.map(msg => ({
      id: msg.id,
      sender: msg.senderId === userId ? "me" : "other",
      text: msg.text,
      timestamp: msg.createdAt,
      senderInfo: msg.sender,
    }));

    return res.json(payload);
  } catch (err) {
    console.error("Error loading messages:", err);
    return res.status(500).json({ error: "Failed to load messages." });
  }
};

/**
 * POST /api/users/:userId/conversations/:peerId/messages
 * Create/send a new 1:1 message from userId to peerId.
 * Body: { text: string }
 */
exports.sendMessage = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const peerId = parseInt(req.params.peerId, 10);
    const { text } = req.body;

    if (!userId || !peerId) {
      return res.status(400).json({ error: "Invalid IDs." });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Message text cannot be empty." });
    }

    const msg = await Message.create({
      senderId: userId,
      receiverId: peerId,
      text: text.trim(),
    });

    const sender = await User.findOne({ where: { userId: userId } }, {
      attributes: ["id", "fullName"],
    });

    return res.status(201).json({
      id: msg.id,
      sender: "me",
      text: msg.text,
      timestamp: msg.createdAt,
      senderInfo: sender,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ error: "Failed to send message." });
  }
};
