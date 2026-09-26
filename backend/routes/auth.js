// =========================================================
// KINDERQUEST - AUTH ROUTES
// =========================================================

const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");


// =========================================================
// REGISTER TEACHER
// POST /api/auth/register
// =========================================================

router.post(
    "/register",
    authController.register
);


// =========================================================
// LOGIN TEACHER
// POST /api/auth/login
// =========================================================

router.post(
    "/login",
    authController.login
);


// =========================================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// PROTECTED ROUTE
// =========================================================

router.put(
    "/change-password",
    authMiddleware,
    authController.changePassword
);


// =========================================================
// FORGOT PASSWORD - VERIFY USERNAME
// POST /api/auth/forgot-password/verify
// =========================================================

router.post(
    "/forgot-password/verify",
    authController.forgotPasswordVerify
);


// =========================================================
// FORGOT PASSWORD - RESET PASSWORD
// POST /api/auth/forgot-password/reset
// =========================================================

router.post(
    "/forgot-password/reset",
    authController.forgotPasswordReset
);


module.exports = router;