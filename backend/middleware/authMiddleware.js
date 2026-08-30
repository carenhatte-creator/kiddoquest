// =========================================================
// KINDERQUEST - AUTHENTICATION MIDDLEWARE
// JWT VERSION
// =========================================================

const jwt = require("jsonwebtoken");

const config = require("../config/config");


// =========================================================
// AUTHENTICATION MIDDLEWARE
// =========================================================

const authMiddleware = (req, res, next) => {

    try {

        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        const authHeader =
            req.headers.authorization;


        // =====================================================
        // CHECK HEADER
        // =====================================================

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authentication token required."

            });

        }


        // =====================================================
        // CHECK BEARER FORMAT
        // =====================================================

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                message: "Invalid authentication format."

            });

        }


        // =====================================================
        // GET TOKEN
        // =====================================================

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Authentication token required."

            });

        }


        // =====================================================
        // VERIFY TOKEN
        // =====================================================

        const decoded =
            jwt.verify(
                token,
                config.JWT_SECRET
            );


        // =====================================================
        // SAVE AUTHENTICATED TEACHER
        // =====================================================

        req.teacher = decoded;

        req.teacher_id = decoded.id;


        // =====================================================
        // CONTINUE
        // =====================================================

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );


        // =====================================================
        // TOKEN EXPIRED
        // =====================================================

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({

                success: false,

                message: "Authentication token expired."

            });

        }


        // =====================================================
        // INVALID TOKEN
        // =====================================================

        return res.status(401).json({

            success: false,

            message: "Invalid authentication token."

        });

    }

};


module.exports = authMiddleware;