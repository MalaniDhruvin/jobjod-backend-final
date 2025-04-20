const express = require("express");
const router = express.Router();
const { createLogin, checkMobileNumber } = require("../controllers/loginController");

router.post("/verify-otp", createLogin);
router.get('/check-mobile', checkMobileNumber);
// router.post("/verify-otp", getToken);

module.exports = router;
