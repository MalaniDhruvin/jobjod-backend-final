const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import your Sequelize instance
const Login = require("./loginModel");

const Education = sequelize.define(
  "Education",
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
    highestEducation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collegeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completionYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1900, // Optional: Set a minimum year
        max: new Date().getFullYear(), // Optional: Ensure it's not a future year
      },
    },
  },
  {
    timestamps: true, // Store createdAt and updatedAt automatically
    tableName: "educations", // Ensure the table name is correct
  }
);

Education.belongsTo(Login, { foreignKey: "userId" });
Login.hasMany(Education, { foreignKey: "userId" });

// Sync Login table first
Login.sync().then(() => {
  // Then sync the table
  Education.sync();
});
module.exports = Education;
