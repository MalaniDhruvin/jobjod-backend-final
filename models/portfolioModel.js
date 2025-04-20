const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assuming you have a sequelize instance setup
const Login = require("./loginModel");
// const User = require("../models/userModel"); // Adjust the path based on your project structure

// Define the Portfolio model
const Portfolio = sequelize.define(
  "Portfolio",
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
        model: "Login", // Ensure this matches your 'Login' table name
        key: "id",
      },
      onDelete: "CASCADE", // Adjust based on your requirements
      onUpdate: "CASCADE", // Adjust based on your requirements
    },
    githubLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedInLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    field1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    field2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    field3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    field4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    field5: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    field6: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    field7: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    field8: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Store createdAt and updatedAt automatically
    tableName: "portfolios", // Ensure the table name is correct
  }
);

// Establish relationships
Portfolio.belongsTo(Login, { foreignKey: "userId" });
Login.hasMany(Portfolio, { foreignKey: "userId" });


// Sync Login table first
Login.sync().then(() => {
  // Then sync the table
  Portfolio.sync();
});
module.exports = Portfolio;
