const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assuming you have a sequelize instance setup
const Login = require("./loginModel");

// Define the Attachment model
const Attachment = sequelize.define(
  "Attachment",
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
    // File name
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Path where the file is stored (e.g., local file path or cloud storage URL)
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // MIME type of the file
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Size of the file (optional)
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Store the created and updated timestamps
    tableName: "attachments",
  }
);

Attachment.belongsTo(Login, { foreignKey: "userId" });
Login.hasMany(Attachment, { foreignKey: "userId" });

// Sync Login table first
Login.sync().then(() => {
  Attachment.sync();
});

module.exports = Attachment;
