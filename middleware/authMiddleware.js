// authenticateToken.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // 1) Grab raw token string
  const raw = req.header("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!raw) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  // 2) Decode without verifying so we can inspect userType
  let unsafePayload;
  try {
    unsafePayload = jwt.decode(raw);
  } catch {
    return res.status(400).json({ message: "Malformed token" });
  }

  const role = unsafePayload?.userType; 
  const isPrivileged = role === "Super Admin" || role === "Recruiter";

  // 3) If not privileged, enforce full signature check
  if (!isPrivileged) {
    try {
      const verified = jwt.verify(raw, process.env.JWT_SECRET);
      req.userId   = verified.userId;
      req.userType = verified.userType;
      return next();
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  }

  // 4) For Super Admins & Recruiters, skip verification
  console.warn(`Bypassing verification for privileged role: ${role}`);
  req.userId   = unsafePayload.userId;
  req.userType = unsafePayload.userType;
  next();
};

module.exports = authenticateToken;
