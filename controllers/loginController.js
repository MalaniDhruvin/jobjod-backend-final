const Login = require("../models/loginModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create a new login or register
exports.createLogin = async (req, res) => {
  const { mobileNumber, otp, userType } = req.body; // Get mobileNumber, OTP, and userType from the request

  try {
    // Check if the mobile number already exists in the database
    let existingLogin = await Login.findOne({ where: { mobileNumber } });

    // If the login exists
    if (existingLogin) {
      // Check if the userType matches the existing one
      if (existingLogin.userType !== userType) {
        // Restrict if the mobile number exists with a different userType
        return res.status(403).json({
          message: `This mobile number is already registered as a ${existingLogin.userType}. It cannot register as a ${userType}.`,
        });
      }

      let token = null;
      // If the login exists and OTP matches
      if (otp === process.env.OTP) {
        if (existingLogin.userType === "Job Giver") {
          // Generate a JWT token for Company Login
          token = jwt.sign(
            { loginId: existingLogin.id, userType: existingLogin.userType },
            process.env.JWT_SECRET_COMPANY,
            { expiresIn: "9h" }
          );
          console.log(existingLogin.userType);
          
        } else {
          // Generate a JWT token for User Login
          token = jwt.sign(
            { loginId: existingLogin.id, userType: existingLogin.userType },
            process.env.JWT_SECRET,
            { expiresIn: "9h" }
          );
        }

        // Successful login
        return res.status(200).json({
          login: existingLogin,
          message: "Login successful",
          token,
        });
      } else {
        // If OTP doesn't match, return an error
        return res.status(400).json({ message: "Invalid OTP" });
      }
    }

    // If the login doesn't exist, proceed with registration
    if (!existingLogin) {
      // If the mobile number does not exist, create a new entry with the provided userType
      existingLogin = await Login.create({ mobileNumber, userType });

      // Check OTP after creating the login
      if (otp === process.env.OTP) {
        // Generate a JWT token for the new user
        const token = jwt.sign(
          { loginId: existingLogin.id, userType: existingLogin.userType }, // Include userType in the payload
          process.env.JWT_SECRET,
          { expiresIn: "6h" }
        );

        // Return the new user registration response
        return res.status(200).json({
          login: existingLogin,
          message: "User registered successfully",
          token,
        });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkMobileNumber = async (req, res) => {
  const { mobileNumber } = req.query; // Get mobile number from query parameters

  try {
    // Check if the mobile number already exists in the database
    const existingLogin = await Login.findOne({ where: { mobileNumber } });

    if (existingLogin) {
      return res.status(200).json({
        exists: true,
        userType: existingLogin.userType, // Return the existing userType if exists
      });
    }

    // If the mobile number doesn't exist, return a response indicating so
    res.status(200).json({
      exists: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
