const Application = require("../models/applicationsModel");
const Login = require("../models/loginModel");

// Get all applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.findAll();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get applications by userId
exports.getApplicationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.findAll({ where: { userId } });

    if (applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this user." });
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if user exists
    const user = await Login.findByPk(userId);
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const newApplication = await Application.create({ userId });
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
