const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Define User model
const Login = sequelize.define(
  "Login",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Store createdAt and updatedAt automatically
    tableName: "login", // Ensure the table name is correct
  }
);

module.exports = Login;
