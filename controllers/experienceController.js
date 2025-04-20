const Experience = require("../models/experienceModel");

// Create Experience
exports.createExperience = async (req, res) => {
  const { experienceEntries } = req.body;

  if (!Array.isArray(experienceEntries) || experienceEntries.length === 0) {
    return res.status(400).json({ message: "Invalid data format." });
  }

  try {
    const createdExperience = await Experience.bulkCreate(experienceEntries);
    res.status(201).json(createdExperience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all experiences for the logged-in user (using userId from token)
exports.getExperiencesForLoggedInUser = async (req, res) => {
  const userId = req.params.userId; // Access userId from the authenticated token

  try {
    // Fetch experiences based on the logged-in user's userId
    const experiences = await Experience.findAll({ _id: userId });

    if (!experiences.length) {
      return res
        .status(404)
        .json({ message: "No experiences found for this user" });
    }

    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all experiences
exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.findAll();
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Experience
exports.updateExperience = async (req, res) => {
  const {
    userId,
    companyName,
    jobTitle,
    industry,
    department,
    startDate,
    endDate,
    employmentType,
    salary,
  } = req.body;
  try {
    const exe = await Experience.findOne(req.userId);
    if (!exe) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's information (excluding password)
    const updatedExe = await exe.update({
      userId,
      companyName,
      jobTitle,
      industry,
      department,
      startDate,
      endDate,
      employmentType,
      salary,
    });
    res.status(200).json(updatedExe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Experience
exports.deleteExperience = async (req, res) => {
  try {
    await Experience.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
