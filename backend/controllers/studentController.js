const db = require("../database/database");

// ==========================================
// ADD STUDENT
// ==========================================

exports.addStudent = (req, res) => {

    const {
        teacher_id,
        first_name,
        last_name,
        age,
        gender
    } = req.body;

    console.log("========== ADD STUDENT ==========");
    console.log(req.body);

    if (!teacher_id || !first_name || !last_name) {

        return res.status(400).json({
            success: false,
            message: "Teacher ID, First Name and Last Name are required."
        });

    }

    // CHECK IF TEACHER EXISTS
    db.get(
        "SELECT * FROM teachers WHERE id = ?",
        [teacher_id],
        (err, teacher) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (!teacher) {

                return res.status(404).json({
                    success: false,
                    message: "Teacher not found."
                });

            }

            // INSERT STUDENT
            db.run(

                `
                INSERT INTO students
                (
                    teacher_id,
                    first_name,
                    last_name,
                    age,
                    gender
                )
                VALUES (?,?,?,?,?)
                `,

                [
                    teacher_id,
                    first_name,
                    last_name,
                    age,
                    gender
                ],

                function (err) {

                    if (err) {

                        console.log("INSERT ERROR:");
                        console.log(err);

                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });

                    }

                    console.log("========================");
                    console.log("INSERT SUCCESS");
                    console.log("Last ID:", this.lastID);
                    console.log("Rows Changed:", this.changes);
                    console.log("========================");

                    // CHECK DATABASE CONTENT
                    db.all(
                        "SELECT * FROM students",
                        [],
                        (e, rows) => {

                            if (e) {
                                console.log(e);
                            } else {
                                console.log("DATABASE CONTENT:");
                                console.table(rows);
                            }

                        }
                    );

                    res.json({

                        success: true,

                        message: "Student added successfully.",

                        student: {

                            id: this.lastID,

                            teacher_id,

                            first_name,

                            last_name,

                            age,

                            gender

                        }

                    });

                }

            );

        }

    );

};
// ==========================================
// GET ALL STUDENTS
// ==========================================

exports.getStudents = (req, res) => {

    const teacher_id = req.query.teacher_id;

    if (!teacher_id) {

        return res.status(400).json({
            success: false,
            message: "Teacher ID is required."
        });

    }

    db.all(

        `
        SELECT *
        FROM students
        WHERE teacher_id = ?
        ORDER BY id DESC
        `,

        [teacher_id],

        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({

                success: true,

                students: rows

            });

        }

    );

};

// ==========================================
// GET ONE STUDENT
// ==========================================

exports.getStudent = (req, res) => {

    db.get(

        `
        SELECT *
        FROM students
        WHERE id = ?
        `,

        [req.params.id],

        (err, row) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (!row) {

                return res.status(404).json({
                    success: false,
                    message: "Student not found."
                });

            }

            res.json({

                success: true,

                student: row

            });

        }

    );

};

// ==========================================
// UPDATE STUDENT
// ==========================================

exports.updateStudent = (req, res) => {

    const {
        first_name,
        last_name,
        age,
        gender
    } = req.body;

    db.run(

        `
        UPDATE students
        SET
            first_name = ?,
            last_name = ?,
            age = ?,
            gender = ?
        WHERE id = ?
        `,

        [
            first_name,
            last_name,
            age,
            gender,
            req.params.id
        ],

        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({

                success: true,

                message: "Student updated successfully."

            });

        }

    );

};

// ==========================================
// DELETE STUDENT
// ==========================================

exports.deleteStudent = (req, res) => {

    db.run(

        `
        DELETE FROM students
        WHERE id = ?
        `,

        [req.params.id],

        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({

                success: true,

                message: "Student deleted successfully."

            });

        }

    );

};