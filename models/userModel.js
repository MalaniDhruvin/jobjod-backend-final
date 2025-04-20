const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Login = require("./loginModel");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      references: {
        model: "Login", // The target model is 'Login'
        key: "id",
      },
      onDelete: "CASCADE", // Adjust based on your requirements
      onUpdate: "CASCADE", // Adjust based on your requirements
    },
    fullName: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    phone: { type: DataTypes.BIGINT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    birthDate: { type: DataTypes.DATEONLY, allowNull: false },
    pincode: { type: DataTypes.INTEGER, allowNull: false },
    appliedFor:{
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    }
  },
  {
    timestamps: true, // Store createdAt and updatedAt automatically
    tableName: "users", // Ensure the table name is correct
  }
);

User.belongsTo(Login, { foreignKey: "userId" });
Login.hasMany(User, { foreignKey: "userId" });

// Sync Login table first
Login.sync().then(() => {
  // Then sync the table
  User.sync();
});
module.exports = User;
