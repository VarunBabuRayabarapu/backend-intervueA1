const express = require("express");
const router = express.Router();
const questionRoutes = require("./routes/questionRoutes");
const studentsRoutes = require("./routes/studentsRoutes");

router.use("/api", questionRoutes);
router.use("/api", studentsRoutes);

module.exports = router;
