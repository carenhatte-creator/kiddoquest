const express = require("express");

const router = express.Router();


const reportController = require("../controllers/reportController");



// ==========================================
// REPORT ROUTES
// ==========================================



// COMPLETE TEACHER REPORT
// GET /api/reports/teacher/:teacher_id

router.get(

    "/teacher/:teacher_id",

    reportController.getTeacherReport

);





// STUDENT REPORT
// GET /api/reports/student/:student_id

router.get(

    "/student/:student_id",

    reportController.getStudentReport

);





// DASHBOARD SUMMARY
// GET /api/reports/summary/:teacher_id

router.get(

    "/summary/:teacher_id",

    reportController.getSummary

);





module.exports = router;