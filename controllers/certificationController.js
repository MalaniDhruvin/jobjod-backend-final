const Certification = require("../models/certificationModel");

// Create a new certification
exports.createCertification = async (req, res) => {
  const { certifications } = req.body;

  try {
    console.log(certifications);  // Log the received body
    const certification = await Certification.bulkCreate(certifications);
    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all certifications
exports.getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.findAll();
    res.status(200).json(certifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single certification by ID
exports.getCertificationById = async (req, res) => {
  const userId = req.userId; // Access userId from the authenticated token
  try {
    const certification = await Certification.findAll(userId);
    if (!certification)
      return res.status(404).json({ message: "Certification not found" });

    res.status(200).json(certification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a certification
exports.updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findByPk(req.params.id);
    if (!certification)
      return res.status(404).json({ message: "Certification not found" });

    await certification.update(req.body);
    res.status(200).json(certification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a certification
exports.deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findByPk(req.params.id);
    if (!certification)
      return res.status(404).json({ message: "Certification not found" });

    await certification.destroy();
    res.status(200).json({ message: "Certification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
