const express = require("express");
const cors = require("cors");
require("dotenv").config();

// =====================================
// CONFIG
// =====================================

const config = require("./config/config");

// =====================================
// DATABASE
// =====================================

require("./database/database");

// =====================================
// EXPRESS APP
// =====================================

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

// CORS
app.use(cors());

// JSON
app.use(express.json());

// URL Encoded
app.use(express.urlencoded({ extended: true }));

// Logger
const logger = require("./middleware/logger");
app.use(logger);

// =====================================
// HOME / HEALTH CHECK
// =====================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "KinderQuest Backend Running",
        status: "online"
    });
});

// =====================================
// ROUTES
// =====================================

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/studentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const reportRoutes = require("./routes/reportRoutes");
const gameRoutes = require("./routes/gameRoutes");

// AUTH
app.use("/api/auth", authRoutes);

// STUDENTS
app.use("/api/students", studentRoutes);

// PROGRESS
app.use("/api/progress", progressRoutes);

// REPORTS
app.use("/api/reports", reportRoutes);

// GAMES
app.use("/api/games", gameRoutes);

// =====================================
// 404 ROUTE
// =====================================

app.use((req, res) => {
    console.log("404:", req.method, req.originalUrl);

    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// =====================================
// ERROR HANDLER
// =====================================

const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);

// =====================================
// PORT
// =====================================

// Render provides the PORT through environment variables.
// Local development will use the configured PORT or 5001.

const PORT = process.env.PORT || config.PORT || 5001;

// =====================================
// START SERVER
// =====================================

// 0.0.0.0 allows Render to access the server.

const server = app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("===================================");
    console.log("KinderQuest Backend Started");
    console.log(`Port: ${PORT}`);
    console.log("===================================");

});

// =====================================
// SERVER ERROR
// =====================================

server.on("error", (err) => {
    console.error("Server Error:", err);
});