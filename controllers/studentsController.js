const { insertStudent, countStudents } = require("../repositories/studentsRepository");
const createStudent = async (req, res) => {
    try {
        const student = req.body;
        const result = await insertStudent(student);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getStudentCount = async (req, res) => {
    try {
        const total = await countStudents();
        res.json({ total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createStudent, getStudentCount };
