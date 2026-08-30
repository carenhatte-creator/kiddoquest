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

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Logger
const logger = require("./middleware/logger");
app.use(logger);

// =====================================
// HOME
// =====================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "KinderQuest Backend Running"

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
// ERROR HANDLER
// =====================================

const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);

// =====================================
// 404
// =====================================

app.use((req, res) => {

    console.log("404:", req.method, req.originalUrl);

    res.status(404).json({

        success: false,

        message: "Route not found"

    });

});

// =====================================
// START SERVER
// =====================================

const PORT = config.PORT || 5001;

const server = app.listen(PORT, () => {

    console.log("");
    console.log("===================================");
    console.log("KinderQuest Backend Started");
    console.log(`URL: http://localhost:${PORT}`);
    console.log("===================================");

});

server.on("error", (err) => {

    console.error(err);

});