const express = require("express");

const router = express.Router();

const studentController = require("../controllers/studentController");


// ==========================================
// GET ALL STUDENTS
// GET /api/students?teacher_id=2
// ==========================================

router.get(
    "/",
    studentController.getStudents
);



// ==========================================
// ADD STUDENT
// POST /api/students
// ==========================================

router.post(
    "/",
    studentController.addStudent
);



// ==========================================
// GET ONE STUDENT
// GET /api/students/1
// ==========================================

router.get(
    "/:id",
    studentController.getStudent
);



// ==========================================
// UPDATE STUDENT
// PUT /api/students/1
// ==========================================

router.put(
    "/:id",
    studentController.updateStudent
);



// ==========================================
// DELETE STUDENT
// DELETE /api/students/1
// ==========================================

router.delete(
    "/:id",
    studentController.deleteStudent
);


module.exports = router;