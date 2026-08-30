const db =
    require("../database/database");

const {
    successResponse,
    errorResponse
} = require("../utils/response");


// ==========================================
// SAVE PROGRESS
// ==========================================

exports.saveProgress = (req, res) => {

    const {

        teacher_id,

        student_id,

        category,

        activity,

        score,

        stars

    } = req.body;


    // ==========================================
    // VALIDATE REQUIRED FIELDS
    // ==========================================

    if (
        !teacher_id ||
        !student_id ||
        !category ||
        !activity ||
        score === undefined
    ) {

        return errorResponse(
            res,
            "Required fields are missing."
        );

    }


    // ==========================================
    // SCORE
    // ==========================================

    const numericScore =
        Number(score) || 0;


    // ==========================================
    // STARS
    // ==========================================
    //
    // IMPORTANT:
    // The GAME sends the actual stars.
    //
    // Backend does NOT calculate stars
    // from score.
    // ==========================================

    let numericStars =
        Number(stars);


    if (
        !Number.isFinite(
            numericStars
        )
    ) {

        numericStars = 0;

    }


    // Keep stars between 0 and 3.

    numericStars =
        Math.max(
            0,
            Math.min(
                3,
                Math.round(
                    numericStars
                )
            )
        );


    // ==========================================
    // STATUS
    // ==========================================

    let status =
        "Not Started";


    if (
        numericScore > 0 &&
        numericScore < 50
    ) {

        status =
            "Needs Practice";

    }
    else if (
        numericScore >= 50 &&
        numericScore < 100
    ) {

        status =
            "In Progress";

    }
    else if (
        numericScore >= 100
    ) {

        status =
            "Completed";

    }


    // ==========================================
    // INSERT PROGRESS
    // ==========================================

    db.run(

        `
        INSERT INTO progress
        (
            teacher_id,
            student_id,
            category,
            activity,
            score,
            stars,
            status
        )
        VALUES (?,?,?,?,?,?,?)
        `,

        [

            teacher_id,

            student_id,

            category,

            activity,

            numericScore,

            numericStars,

            status

        ],

        function (err) {

            if (err) {

                console.error(
                    "SAVE PROGRESS ERROR:",
                    err.message
                );


                return errorResponse(
                    res,
                    err.message
                );

            }


            // ==========================================
            // SUCCESS
            // ==========================================

            return successResponse(

                res,

                "Progress saved successfully.",

                {

                    id:
                        this.lastID,

                    teacher_id:
                        teacher_id,

                    student_id:
                        student_id,

                    category:
                        category,

                    activity:
                        activity,

                    score:
                        numericScore,

                    stars:
                        numericStars,

                    status:
                        status

                }

            );

        }

    );

};


// ==========================================
// GET ALL PROGRESS OF TEACHER
// ==========================================

exports.getTeacherProgress =
    (req, res) => {

        const teacher_id =
            req.params.teacher_id;


        db.all(

            `
            SELECT

                progress.*,

                students.first_name,

                students.last_name

            FROM progress

            INNER JOIN students

            ON progress.student_id =
               students.id

            WHERE progress.teacher_id = ?

            ORDER BY progress.created_at DESC
            `,

            [

                teacher_id

            ],

            (err, rows) => {

                if (err) {

                    return errorResponse(
                        res,
                        err.message
                    );

                }


                return successResponse(

                    res,

                    "Teacher progress retrieved successfully.",

                    rows

                );

            }

        );

    };


// ==========================================
// GET STUDENT PROGRESS
// ==========================================

exports.getStudentProgress =
    (req, res) => {

        db.all(

            `
            SELECT *

            FROM progress

            WHERE student_id = ?

            ORDER BY created_at DESC
            `,

            [

                req.params.student_id

            ],

            (err, rows) => {

                if (err) {

                    return errorResponse(
                        res,
                        err.message
                    );

                }


                return successResponse(

                    res,

                    "Student progress retrieved successfully.",

                    rows

                );

            }

        );

    };


// ==========================================
// DELETE PROGRESS
// ==========================================

exports.deleteProgress =
    (req, res) => {

        db.run(

            `
            DELETE FROM progress

            WHERE id = ?
            `,

            [

                req.params.id

            ],

            function (err) {

                if (err) {

                    return errorResponse(
                        res,
                        err.message
                    );

                }


                return successResponse(

                    res,

                    "Progress deleted successfully."

                );

            }

        );

    };


// ==========================================
// RESET ALL PROGRESS OF A TEACHER
// ==========================================

exports.resetTeacherProgress =
    (req, res) => {

        const teacher_id =
            req.params.teacher_id;


        if (!teacher_id) {

            return errorResponse(
                res,
                "Teacher ID is required."
            );

        }


        db.run(

            `
            DELETE FROM progress

            WHERE teacher_id = ?
            `,

            [

                teacher_id

            ],

            function (err) {

                if (err) {

                    return errorResponse(
                        res,
                        err.message
                    );

                }


                return successResponse(

                    res,

                    "All progress records reset successfully.",

                    {

                        deleted:
                            this.changes

                    }

                );

            }

        );

    };