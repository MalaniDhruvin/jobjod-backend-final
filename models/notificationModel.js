const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Human-readable notification text',
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID of the user receiving the notification',
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Flag indicating if the user has read the notification',
  },
}, {
  tableName: 'Notifications',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = Notification;
