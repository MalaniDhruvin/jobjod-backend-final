const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Login = require("./loginModel");
// const User = require("./userModel");

const Preference = sequelize.define(
  "Preference",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
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
    employmentType: { type: DataTypes.STRING, allowNull: true },
    workplace: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    shift: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: true, // Store createdAt and updatedAt automatically
    tableName: "preferences", // Ensure the table name is correct
  }
);

Preference.belongsTo(Login, { foreignKey: "userId" });
Login.hasMany(Preference, { foreignKey: "userId" });

// Sync Login table first
Login.sync().then(() => {
  // Then sync the table
  Preference.sync();
});
module.exports = Preference;
