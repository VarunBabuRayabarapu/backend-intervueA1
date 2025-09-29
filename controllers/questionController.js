const { insertQuestion, fetchQuestions,fetchActiveQuestion, addAnswer } = require("../repositories/questionRepository");

let io;
const setSocketIo = (socketServer) => {
  io = socketServer;
};

const getQuestions = async (req, res) => {
  try {
    const questions = await fetchQuestions();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const postQuestion = async (req, res) => {
  try {
    const question = req.body;
    const result = await insertQuestion(question);
    if (io) io.emit("new-question", question);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { questionId, studentName, selectedOption } = req.body;
    const result = await addAnswer(questionId, { studentName, selectedOption });
    if (io) io.emit("new-answer", { questionId, studentName, selectedOption });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getActiveQuestion = async (req, res) => {
  try {
    const question = await fetchActiveQuestion();
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getQuestions, postQuestion, submitAnswer, setSocketIo , getActiveQuestion};
