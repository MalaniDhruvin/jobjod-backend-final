const Skill = require("../models/skillModel");

// Create Skills
exports.createSkills = async (req, res) => {
  const { userId, skills } = req.body;

  console.log(userId, skills);

  if (!userId || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    // Insert multiple skills into the database using bulkCreate
    const skillEntries = skills.map((skill) => ({ userId, skill }));

    // Bulk create skills
    await Skill.bulkCreate(skillEntries);
    res.status(201).json({ message: "Skills saved successfully" });
  } catch (err) {
    console.error("Error inserting skills:", err);
    res.status(500).json({ error: "Failed to insert skills" });
  }
};

exports.createSkill = async (req, res) => {
  try {
    // Bulk create skills
    await Skill.create(req.body);
    res.status(201).json({ message: "Skills saved successfully" });
  } catch (err) {
    console.error("Error inserting skills:", err);
    res.status(500).json({ error: "Failed to insert skills" });
  }
};

exports.getSpecificData = async (req, res) => {
  const userId = req.params.userId; // Access userId from the authenticated token

  try {
    // Fetch user data from the database by the provided ID
    const userData = await Skill.findAll({ _id: userId });

    // console.log(userData);

    // If the user is not found
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return the user data in the response
    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Skill
exports.updateSkill = async (req, res) => {
  const { userId, skill } = req.body;
  try {
    const skills = await Skill.findOne(req.userId);
    if (!skills) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's information (excluding password)
    const updatedSkill = await skills.update({
      userId,
      skill,
    });
    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Skill
exports.deleteSkill = async (req, res) => {
  try {
    await Skill.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
