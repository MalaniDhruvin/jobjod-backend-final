const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import your Sequelize instance
const Login = require("./loginModel");

const Skill = sequelize.define(
  "Skill",
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
    skill: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Store createdAt and updatedAt automatically
    tableName: "skills", // Ensure the table name is correct
  }
);

Skill.belongsTo(Login, { foreignKey: "userId" });
Login.hasMany(Skill, { foreignKey: "userId" });

// Sync Login table first
Login.sync().then(() => {
  // Then sync the table
  Skill.sync();
});

module.exports = Skill;
