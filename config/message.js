const User = require("../models/userModel");
const Message = require("../models/messageModel");

// Setup Sequelize model relationships
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

// Export if needed
module.exports = { User, Message };
