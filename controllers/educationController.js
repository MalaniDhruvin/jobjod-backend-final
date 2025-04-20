const Education = require("../models/educationModel");

// Create Education
exports.createEducation = async (req, res) => {
  const { educationEntries } = req.body;

  if (!Array.isArray(educationEntries) || educationEntries.length === 0) {
    return res.status(400).json({ message: "Invalid data format." });
  }

  try {
    const createdEducation = await Education.bulkCreate(educationEntries);
    res.status(201).json(createdEducation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all experiences for the logged-in user (using userId from token)
exports.getEducationForLoggedInUser = async (req, res) => {
  const userId = req.params.userId; // Access userId from the authenticated token

  try {
    // Fetch experiences based on the logged-in user's userId
    const educationRecords = await Education.findAll({ _id: userId });

    if (!educationRecords.length) {
      return res
        .status(404)
        .json({ message: "No experiences found for this user" });
    }

    res.status(200).json(educationRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all education records
exports.getAllEducation = async (req, res) => {
  try {
    const educationRecords = await Education.findAll();
    res.status(200).json(educationRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Education
exports.updateEducation = async (req, res) => {
  const {
    userId,
    highestEducation,
    degree,
    specialization,
    collegeName,
    completionYear,
  } = req.body;
  try {
    const edu = await Education.findOne(req.userId);
    if (!edu) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's information (excluding password)
    const updatedEdu = await edu.update({
      userId,
      highestEducation,
      degree,
      specialization,
      collegeName,
      completionYear,
    });
    res.status(200).json(updatedEdu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Education
exports.deleteEducation = async (req, res) => {
  try {
    await Education.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Education record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
