const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Login = require('./loginModel');

const Certification = sequelize.define('Certification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    certificateTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    organization: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    validTill: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true
});

Certification.belongsTo(Login, { foreignKey: "userId" });
Login.hasMany(Certification, { foreignKey: "userId" });

// Sync Login table first
Login.sync().then(() => {
  // Then sync the table
  Certification.sync();
});

module.exports = Certification;
