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
  const { userId, skills } = req.body;

  console.log(userId, skills);

  if (!userId || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    // Insert multiple skills into the database using bulkCreate
    const skillEntries = skills.map(({ name, level, rating }) => ({
      userId,
      skill: name,
      level,
      rating,
    }));

    //  console.log(skillEntries)

    // Bulk create skills
    const created = await Skill.bulkCreate(skillEntries);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error inserting skills:", err);
    res.status(500).json({ error: "Failed to insert skills" });
  }
};

exports.getSpecificData = async (req, res) => {
  const userId = req.params.userId; // Access userId from the authenticated token

  try {
    // Fetch user data from the database by the provided ID
    const userData = await Skill.findAll({ where: { userId } });
    console.log("User data fetched:", userData);

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
  const { userId, skills } = req.body; // Expecting skills array

  try {
    const existing = await Skill.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const { name, level, rating } = skills[0]; // Take first skill object

    // Update the skill
    const updated = await existing.update({
      userId,
      skill: name,
      level,
      rating,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating skill:", error);
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

exports.matchJobSkills = async (req, res) => {
  let { jobSkills } = req.body;

  // console.log("Job skills input:", jobSkills);

  // 1️⃣ Normalize jobSkills to array of lowercase strings
  let required = [];
  if (typeof jobSkills === "string") {
    required = jobSkills.split(",").map((s) => s.trim().toLowerCase());
  } else if (Array.isArray(jobSkills)) {
    required = jobSkills
      .filter((s) => typeof s === "string")
      .map((s) => s.trim().toLowerCase());
  } else {
    return res
      .status(400)
      .json({
        message:
          "Invalid data. Expect jobSkills as string or array of strings.",
      });
  }
  required = required.filter(Boolean);

  try {
    // 2️⃣ Fetch all user skills
    const userEntries = await Skill.findAll();

    // 3️⃣ Group skills by userId
    const skillsByUser = userEntries.reduce((acc, { userId, skill }) => {
      const name = skill.trim().toLowerCase();
      if (!acc[userId]) acc[userId] = new Set();
      acc[userId].add(name);
      return acc;
    }, {});

    // console.log("Skills by user:", skillsByUser);

    // 4️⃣ Build result for each user
    const matches = Object.entries(skillsByUser).map(([uid, skillSet]) => {
      // find overlapping skills
      const matchedSkills = required.filter((skill) => skillSet.has(skill));
      const matchCount = matchedSkills.length;
      const isMatch = matchCount >= 1;

      return {
        userId: parseInt(uid, 10),
        match: isMatch ? "yes" : "no",
        matchCount,
        matchedSkills,
      };
    });

    // 5️⃣ Return all user matches
    return res.status(200).json({ matches });
  } catch (error) {
    console.error("Error matching job skills:", error);
    return res.status(500).json({ message: "Failed to match job skills" });
  }
};
