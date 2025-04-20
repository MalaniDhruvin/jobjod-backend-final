const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Define User model
const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Login", // The target model is 'Login'
        key: "id",
      },
      onDelete: "CASCADE", // Adjust based on your requirements
      onUpdate: "CASCADE", // Adjust based on your requirements
    },
  },
  {
    timestamps: true, // Store createdAt and updatedAt automatically
    tableName: "applications", // Ensure the table name is correct
  }
);

module.exports = Application;
