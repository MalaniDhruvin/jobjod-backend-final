const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Login = require("./loginModel");

const Experience = sequelize.define(
  "Experience",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
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
    companyName: { type: DataTypes.STRING, allowNull: false },
    jobTitle: { type: DataTypes.STRING, allowNull: false },
    industry: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    employmentType: { type: DataTypes.STRING, allowNull: false },
    salary: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true, // Store createdAt and updatedAt automatically
    tableName: "experiences", // Ensure the table name is correct
  }
);

Experience.belongsTo(Login, { foreignKey: "userId" });
Login.hasMany(Experience, { foreignKey: "userId" });

// Sync Login table first
Login.sync().then(() => {
  // Then sync the table
  Experience.sync();
});

module.exports = Experience;
