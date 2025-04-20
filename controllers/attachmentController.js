const multer = require("multer");
const path = require("path");
const Attachment = require("../models/attachmentModel");
const Portfolio = require("../models/portfolioModel");
const sequelize = require("../config/db");

// Configure Multer for File Uploads (Resume)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage: storage });

// Create or Update Profile
exports.createOrUpdateProfile = [
  upload.single("file"), // Handles file upload
  async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { userId, githubLink, linkedInLink } = req.body;
      const { file } = req; // Uploaded file

      // Validate required fields
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // If a file is uploaded, save resume
      let attachment = null;
      if (file) {
        attachment = await Attachment.create(
          {
            userId, // Updated to match DB schema
            fileName: file.originalname,
            filePath: file.path,
            mimeType: file.mimetype,
            fileSize: file.size,
          },
          { transaction }
        );
      }

      // Update or create portfolio links
      const portfolioData = {};
      if (githubLink) portfolioData.githubLink = githubLink;
      if (linkedInLink) portfolioData.linkedInLink = linkedInLink;

      if (Object.keys(portfolioData).length > 0) {
        await Portfolio.upsert(
          { userId, ...portfolioData }, // Insert or update
          { transaction }
        );
      }

      // Commit the transaction
      await transaction.commit();
      res
        .status(201)
        .json({ message: "Profile updated successfully", attachment });
    } catch (error) {
      // Rollback the transaction in case of any error
      await transaction.rollback();
      console.error("Error during profile update:", error.message); // Log detailed error
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    }
  },
];

// Get Profile Data (Resume & Portfolio Links)
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get Resume File
    const attachment = await Attachment.findOne({ where: { userId } });

    // Get Portfolio Links
    const portfolio = await Portfolio.findOne({ where: { userId } });

    res.status(200).json({ attachment, portfolio });
  } catch (error) {
    console.error("Error:", error.message); // Log detailed error message
    res.status(500).json({ message: error.message });
  }
};

// Update Portfolio Links
exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { githubLink, linkedInLink } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Portfolio ID is required" });
    }

    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    await Portfolio.update({ githubLink, linkedInLink }, { where: { id } });

    res.status(200).json({ message: "Portfolio link updated successfully" });
  } catch (error) {
    console.error("Error:", error.message); // Log detailed error message
    res.status(500).json({ message: error.message });
  }
};

// Delete Resume (PDF)
exports.deleteResume = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Delete the resume (PDF)
    const result = await Attachment.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message); // Log detailed error message
    res.status(500).json({ message: error.message });
  }
};

// Delete Portfolio Link
exports.deletePortfolioLink = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Delete the portfolio link
    const result = await Portfolio.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: "Portfolio link not found" });
    }

    res.status(200).json({ message: "Portfolio link deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message); // Log detailed error message
    res.status(500).json({ message: error.message });
  }
};
