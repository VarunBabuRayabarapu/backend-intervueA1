const express = require("express");
const { postQuestion, getQuestions,getActiveQuestion, submitAnswer } = require("../controllers/questionController");
const router = express.Router();

router.get("/questions", getQuestions);
router.get("/active-question", getActiveQuestion);
router.post("/question", postQuestion);
router.post("/answer", submitAnswer);

module.exports = router;
