const express = require("express");

const router = express.Router();

const progressController =
    require("../controllers/progressController");


router.post(
    "/save",
    progressController.saveProgress
);


router.get(
    "/teacher/:teacher_id",
    progressController.getTeacherProgress
);


router.delete(
    "/teacher/:teacher_id/reset",
    progressController.resetTeacherProgress
);


router.get(
    "/student/:student_id",
    progressController.getStudentProgress
);


router.delete(
    "/:id",
    progressController.deleteProgress
);


module.exports = router;