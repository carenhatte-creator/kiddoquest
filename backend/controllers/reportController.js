const db = require("../database/database");

const {
    successResponse,
    errorResponse
} = require("../utils/response");



// ==========================================
// COMPLETE REPORT OF TEACHER
// ==========================================

exports.getTeacherReport = (req,res)=>{


    const teacher_id = req.params.teacher_id;



    const sql = `

    SELECT

        students.id,

        students.first_name,

        students.last_name,

        progress.category,

        progress.activity,

        progress.score,

        progress.status,

        progress.created_at


    FROM students


    LEFT JOIN progress


    ON students.id = progress.student_id


    WHERE students.teacher_id = ?


    ORDER BY students.last_name ASC


    `;



    db.all(

        sql,

        [teacher_id],

        (err,rows)=>{


            if(err){

                return errorResponse(
                    res,
                    err.message
                );

            }



            successResponse(

                res,

                "Teacher report retrieved.",

                rows

            );


        }

    );


};





// ==========================================
// STUDENT REPORT
// ==========================================

exports.getStudentReport = (req,res)=>{


    const student_id = req.params.student_id;



    db.all(

        `

        SELECT

            students.first_name,

            students.last_name,

            progress.category,

            progress.activity,

            progress.score,

            progress.status,

            progress.created_at


        FROM students


        LEFT JOIN progress


        ON students.id = progress.student_id


        WHERE students.id = ?


        ORDER BY progress.created_at DESC


        `,


        [student_id],


        (err,rows)=>{


            if(err){

                return errorResponse(
                    res,
                    err.message
                );

            }



            successResponse(

                res,

                "Student report retrieved.",

                rows

            );


        }

    );


};





// ==========================================
// DASHBOARD SUMMARY
// ==========================================

exports.getSummary = (req,res)=>{


    const teacher_id = req.params.teacher_id;



    db.get(

        `

        SELECT


        COUNT(DISTINCT students.id)

        AS total_students,


        COUNT(progress.id)

        AS total_activities,


        IFNULL(SUM(progress.score),0)

        AS total_score,


        IFNULL(AVG(progress.score),0)

        AS average_score



        FROM students


        LEFT JOIN progress


        ON students.id = progress.student_id



        WHERE students.teacher_id = ?


        `,


        [teacher_id],


        (err,row)=>{


            if(err){

                return errorResponse(
                    res,
                    err.message
                );

            }



            successResponse(

                res,

                "Dashboard summary retrieved.",

                row

            );


        }

    );


};