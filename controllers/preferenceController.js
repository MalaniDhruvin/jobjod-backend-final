const Preference = require("../models/preferenceModel");

// Create Preference
exports.createPreference = async (req, res) => {
  try {
    const preference = await Preference.create(req.body);
    res.status(201).json(preference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all preferences for the logged-in user (using userId from token)
exports.getPreferencesForLoggedInUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch preferences based on the logged-in user's userId
    const preferences = await Preference.findAll({
      where: { userId: userId },
    });

    if (!preferences.length) {
      return res
        .status(404)
        .json({ message: "No preferences found for this user" });
    }

    console.log(preferences);

    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all preferences
// exports.getAllPreferences = async (req, res) => {
//   try {
//     const preferences = await Preference.findAll();
//     res.status(200).json(preferences);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Update Preference
exports.updatePreference = async (req, res) => {
  try {
    const preference = await Preference.update(req.body, {
      where: { id: req.params.id },
    });

    if (!preference[0]) {
      return res.status(404).json({ message: "Preference not found" });
    }

    res.status(200).json({ message: "Preference updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Preference
exports.deletePreference = async (req, res) => {
  const { field } = req.body;
  // whitelist allowed preference‐columns
  const allowed = ["employmentType", "location", "shift", "workplace"];
  if (!allowed.includes(field)) {
    return res.status(400).json({ message: "Invalid field name" });
  }

  try {
    // set that one column to empty string
    const [updatedCount] = await Preference.update(
      { [field]: "" },
      { where: { id: req.params.id } }
    );

    if (!updatedCount) {
      return res.status(404).json({ message: "Preference not found" });
    }

    res.status(200).json({ message: `${field} cleared successfully` });
  } catch (error) {
    console.error("Error clearing preference field:", error);
    res.status(500).json({ message: error.message });
  }
};

