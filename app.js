const express = require("express");
const app = express();
const sequelize = require("./config/db");
const cors = require("cors");

// Import routes
const userRoutes = require("./routes/userRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const skillRoutes = require("./routes/skillRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");
// const applicationRoutes = require("./routes/applicationRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const loginRoutes = require("./routes/loginRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use(express.json());
app.use(cors());

app.use("/api/otp", loginRoutes); // OTP based login/signup
app.use("/api/users", userRoutes); // Public routes for user login
app.use("/api/experiences", experienceRoutes); // Protected routes for experiences
app.use("/api/education", educationRoutes); // Protected routes for education
app.use("/api/skills", skillRoutes); // Protected routes for skills
app.use("/api/attachments", attachmentRoutes); // Protected routes for attachments
app.use("/api/preferences", preferenceRoutes); // Protected routes for preference
app.use("/api/certifications", certificationRoutes); // Protected routes for certifications
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes); // Protected routes for messages
app.use("/api/notifications", notificationRoutes); // Protected routes for notifications

// Sync database

sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
