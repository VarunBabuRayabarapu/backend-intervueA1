const { getDB } = require("../adapters/dbAdapter");

const insertStudent = async (student) => {
    const db = getDB();
    return db.collection("students").insertOne({ ...student, createdAt: new Date() });
};

const countStudents = async () => {
    const db = getDB();
    return db.collection("students").countDocuments();
};

module.exports = { insertStudent, countStudents };
