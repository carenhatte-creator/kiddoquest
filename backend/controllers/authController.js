// =========================================================
// KINDERQUEST - AUTH CONTROLLER
// SECURE VERSION
// =========================================================

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../database/database");

const {
    successResponse,
    errorResponse
} = require("../utils/response");

const config = require("../config/config");


// =========================================================
// JWT TOKEN
// =========================================================

function createToken(teacher) {

    return jwt.sign(

        {
            id: teacher.id,
            username: teacher.username,
            fullname: teacher.fullname
        },

        config.JWT_SECRET,

        {
            expiresIn: "2h"
        }

    );

}


// =========================================================
// REGISTER TEACHER
// POST /api/auth/register
// =========================================================

exports.register = async (req, res) => {

    try {

        const {
            fullname,
            username,
            password
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (!fullname || !username || !password) {

            return errorResponse(
                res,
                "Fullname, username and password are required."
            );

        }


        const cleanFullname = fullname.trim();
        const cleanUsername = username.trim();


        if (!cleanFullname || !cleanUsername || !password) {

            return errorResponse(
                res,
                "Please complete all fields."
            );

        }


        // =================================================
        // PASSWORD LENGTH
        // =================================================

        if (password.length < 6) {

            return errorResponse(
                res,
                "Password must be at least 6 characters."
            );

        }


        // =================================================
        // CHECK USERNAME
        // =================================================

        db.get(

            `
            SELECT id
            FROM teachers
            WHERE username = ?
            `,

            [cleanUsername],

            async (err, teacher) => {

                if (err) {

                    console.error(
                        "Register database error:",
                        err
                    );

                    return errorResponse(
                        res,
                        "Unable to create account."
                    );

                }


                // =================================================
                // USERNAME EXISTS
                // =================================================

                if (teacher) {

                    return errorResponse(
                        res,
                        "Username already exists."
                    );

                }


                try {

                    // =============================================
                    // HASH PASSWORD
                    // =============================================

                    const hashedPassword =
                        await bcrypt.hash(password, 10);


                    // =============================================
                    // INSERT TEACHER
                    // =============================================

                    db.run(

                        `
                        INSERT INTO teachers
                        (
                            fullname,
                            username,
                            password
                        )
                        VALUES (?, ?, ?)
                        `,

                        [
                            cleanFullname,
                            cleanUsername,
                            hashedPassword
                        ],

                        function (insertError) {

                            if (insertError) {

                                console.error(
                                    "Register insert error:",
                                    insertError
                                );

                                return errorResponse(
                                    res,
                                    "Unable to create account."
                                );

                            }


                            // =====================================
                            // SUCCESS
                            // =====================================

                            return successResponse(

                                res,

                                "Teacher account created successfully.",

                                {
                                    id: this.lastID,

                                    fullname: cleanFullname,

                                    username: cleanUsername
                                }

                            );

                        }

                    );

                } catch (hashError) {

                    console.error(
                        "Password hashing error:",
                        hashError
                    );

                    return errorResponse(
                        res,
                        "Unable to secure password."
                    );

                }

            }

        );

    } catch (error) {

        console.error(
            "Register error:",
            error
        );

        return errorResponse(
            res,
            "Unable to create account."
        );

    }

};


// =========================================================
// LOGIN TEACHER
// POST /api/auth/login
// =========================================================

exports.login = (req, res) => {

    const {
        username,
        password
    } = req.body;


    // =====================================================
    // VALIDATION
    // =====================================================

    if (!username || !password) {

        return errorResponse(
            res,
            "Username and password are required."
        );

    }


    const cleanUsername = username.trim();


    // =====================================================
    // FIND TEACHER
    // =====================================================

    db.get(

        `
        SELECT
            id,
            fullname,
            username,
            password
        FROM teachers
        WHERE username = ?
        `,

        [cleanUsername],

        async (err, teacher) => {

            if (err) {

                console.error(
                    "Login database error:",
                    err
                );

                return errorResponse(
                    res,
                    "Unable to login."
                );

            }


            // =================================================
            // TEACHER NOT FOUND
            // =================================================

            if (!teacher) {

                return errorResponse(
                    res,
                    "Invalid username or password."
                );

            }


            try {

                // =============================================
                // COMPARE PASSWORD
                // =============================================

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        teacher.password
                    );


                if (!passwordMatch) {

                    return errorResponse(
                        res,
                        "Invalid username or password."
                    );

                }


                // =============================================
                // CREATE JWT
                // =============================================

                const token =
                    createToken(teacher);


                // =============================================
                // SUCCESS
                // =============================================

                return successResponse(

                    res,

                    "Login successful.",

                    {

                        token: token,

                        teacher: {

                            id: teacher.id,

                            fullname: teacher.fullname,

                            username: teacher.username

                        }

                    }

                );

            } catch (compareError) {

                console.error(
                    "Password verification error:",
                    compareError
                );

                return errorResponse(
                    res,
                    "Unable to login."
                );

            }

        }

    );

};


// =========================================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// =========================================================

exports.changePassword = async (req, res) => {

    try {

        const {
            teacher_id,
            currentPassword,
            newPassword
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !teacher_id ||
            !currentPassword ||
            !newPassword
        ) {

            return errorResponse(
                res,
                "Teacher ID, current password, and new password are required."
            );

        }


        if (newPassword.length < 6) {

            return errorResponse(
                res,
                "New password must be at least 6 characters."
            );

        }


        // =================================================
        // FIND TEACHER
        // =================================================

        db.get(

            `
            SELECT
                id,
                fullname,
                username,
                password
            FROM teachers
            WHERE id = ?
            `,

            [teacher_id],

            async (err, teacher) => {

                if (err) {

                    console.error(
                        "Change password database error:",
                        err
                    );

                    return errorResponse(
                        res,
                        "Unable to change password."
                    );

                }


                // =============================================
                // TEACHER NOT FOUND
                // =============================================

                if (!teacher) {

                    return errorResponse(
                        res,
                        "Teacher account not found."
                    );

                }


                try {

                    // =========================================
                    // VERIFY CURRENT PASSWORD
                    // =========================================

                    const passwordMatch =
                        await bcrypt.compare(
                            currentPassword,
                            teacher.password
                        );


                    if (!passwordMatch) {

                        return errorResponse(
                            res,
                            "Current password is incorrect."
                        );

                    }


                    // =========================================
                    // HASH NEW PASSWORD
                    // =========================================

                    const hashedPassword =
                        await bcrypt.hash(
                            newPassword,
                            10
                        );


                    // =========================================
                    // UPDATE PASSWORD
                    // =========================================

                    db.run(

                        `
                        UPDATE teachers
                        SET password = ?
                        WHERE id = ?
                        `,

                        [
                            hashedPassword,
                            teacher_id
                        ],

                        function (updateError) {

                            if (updateError) {

                                console.error(
                                    "Password update error:",
                                    updateError
                                );

                                return errorResponse(
                                    res,
                                    "Unable to change password."
                                );

                            }


                            // =================================
                            // SUCCESS
                            // =================================

                            return successResponse(

                                res,

                                "Password changed successfully."

                            );

                        }

                    );

                } catch (passwordError) {

                    console.error(
                        "Password processing error:",
                        passwordError
                    );

                    return errorResponse(
                        res,
                        "Unable to change password."
                    );

                }

            }

        );

    } catch (error) {

        console.error(
            "Change password error:",
            error
        );

        return errorResponse(
            res,
            "Unable to change password."
        );

    }

};