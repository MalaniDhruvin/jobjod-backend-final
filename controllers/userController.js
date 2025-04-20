const User = require("../models/userModel");
const { literal } = require('sequelize');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create a new user
exports.createUser = async (req, res) => {
  const {
    userId,
    fullName,
    gender,
    email,
    phone,
    location,
    birthDate,
    pincode,
  } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const user = await User.create({
      userId,
      fullName,
      gender,
      email,
      phone,
      location,
      birthDate,
      pincode,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSpecificData = async (req, res) => {
  const userId = req.params.userId; // Access userId from request parameters

  try {
    // Fetch user data from the database by the provided ID
    const userData = await User.findOne({ where: { userId: userId } });

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


// // Login user and generate JWT token
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Compare password (for regular users)
//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token for regular user
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     // Return the token
//     res.status(200).json({ role: "JobSeeker", token });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get user data (after validating JWT token)
exports.getData = async (req, res) => {
  try {
    const user = await User.findOne(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user data (excluding password)
exports.updateUser = async (req, res) => {
  const userId = req.params.userId; // Access userId from request parameters
  const {
    gender,
    email,
    phone,
    location,
    birthDate,
    pincode,
  } = req.body;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await user.update({
      gender,
      email,
      phone,
      location,
      birthDate,
      pincode,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user account
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addApplicant = async (req, res) => {
  try {
    // Expect the user ID in the URL and the complete array of jobIds in the request body.
    // For example: POST /api/users/5/apply with body: { jobIds: ["1", "2", "5"] }
    const { userId } = req.params;
    const { jobIds } = req.body;

    // Validate that jobIds is provided and is an array.
    if (!Array.isArray(jobIds)) {
      return res.status(400).json({ message: "jobIds must be provided as an array" });
    }

    // Find the user by their primary key.
    const user = await User.findOne({ where: { userId: userId } });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Directly update the appliedFor field with the jobIds array provided by the frontend.
    await user.update({ appliedFor: jobIds });

    // Return the updated appliedFor array.
    res.status(200).json({
      message: "Applied jobs updated successfully",
      appliedFor: user.appliedFor,  // Note: You might want to re-fetch or rely on the updated instance.
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppliedFor = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user by primary key
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the appliedFor data
    return res.status(200).json({ 
      appliedFor: user.appliedFor 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAppliedOnByJobId = async (req, res) => {
  try {
    // Get the user id from req.user (set by authentication middleware)
    // Get the job id from request parameters
    const { jobId,userId } = req.params;
    
    // Find the user using the primary key (adjust the method as needed for your ORM)
    const user = await User.findOne({ where: { userId: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Assume appliedFor is stored as an array of objects within the user record.
    // Find the job application entry that matches the jobId.
    const appliedEntry = user.appliedFor.find(item => item.id === jobId);
    if (!appliedEntry) {
      return res.status(404).json({ message: "Job not found in appliedFor list" });
    }
    
    // Return the applied job object with appliedOn date and status.
    res.status(200).json({ appliedFor: appliedEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// controllers/jobController.js

exports.getUsersAppliedForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1️⃣ Fetch users whose appliedFor array contains this jobId
    const users = await User.findAll({
      // include the JSON column so we can read it in JS
      attributes: ['id', 'fullName', 'email','phone', 'appliedFor'],
      where: literal(
        `JSON_SEARCH(appliedFor, 'one', '${jobId}', NULL, '$[*].id') IS NOT NULL`
      )
    });

    if (!users.length) {
      return res
        .status(404)
        .json({ message: "No users found for the given jobId." });
    }

    // 2️⃣ For each user, find the matching appliedFor entry and extract appliedOn
    const usersApplied = users.map((u) => {
      // appliedFor is a JS array of objects [{ id, appliedOn }, …]
      const appliedForEntry = u.appliedFor.find((entry) => 
        String(entry.id) === String(jobId)
      );

      return {
        id: u.id,
        name: u.fullName,
        phone: u.phone,
        email: u.email,
        // 3️⃣ pluck appliedOn (or null if missing)
        appliedOn: appliedForEntry ? appliedForEntry.appliedOn : null,
        status: appliedForEntry ? appliedForEntry.status : null
      };
    });

    // 4️⃣ Return cleaned‐up objects (no raw appliedFor)
    return res.status(200).json({ usersApplied });

  } catch (error) {
    console.error("Error retrieving applications:", error);
    return res.status(500).json({ message: error.message });
  }
};


// PUT /api/users/:userId/appliedFor/:jobId/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Missing 'status' in request body." });
    }

    // 1️⃣ Load user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2️⃣ Update the appliedFor array in‑memory
    const updatedAppliedFor = (user.appliedFor || []).map((entry) => {
      if (String(entry.id) === String(jobId)) {
        return { ...entry, status };
      }
      return entry;
    });

    // Make sure we actually found & updated something
    const found = (user.appliedFor || []).some(e => String(e.id) === String(jobId));
    if (!found) {
      return res
        .status(404)
        .json({ message: `Job ${jobId} not found in user's appliedFor.` });
    }

    // 3️⃣ Persist back to the DB
    await user.update({ appliedFor: updatedAppliedFor });

    // 4️⃣ Return the updated entry (or full array if you prefer)
    const updatedEntry = updatedAppliedFor.find(e => String(e.id) === String(jobId));
    return res.status(200).json({ appliedFor: updatedEntry });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ message: error.message });
  }
};
