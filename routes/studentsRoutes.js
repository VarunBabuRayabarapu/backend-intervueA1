const express = require("express");
const { createStudent, getStudentCount } = require("../controllers/studentsController");
const router = express.Router();

router.post("/students", createStudent);
router.get("/students-count", getStudentCount);

module.exports = router;
