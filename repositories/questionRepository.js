const { getDB } = require("../adapters/dbAdapter");
const { ObjectId } = require("mongodb");

const insertQuestion = async (question) => {
    const db = getDB();
    const doc = {
        ...question,
        createdAt: new Date(),
        timer: question.timer || 60,
        isActive: true
    };

    // set all existing active questions as inactive
    await db.collection("questions").updateMany({ isActive: true }, { $set: { isActive: false } });

    // insert new question
    const result = await db.collection("questions").insertOne(doc);

    // schedule to deactivate question after timer seconds
    setTimeout(async () => {
        await db.collection("questions").updateOne(
            { _id: result.insertedId },
            { $set: { isActive: false } }
        );
    }, doc.timer * 1000);

    return result;
};

const fetchActiveQuestion = async () => {
    const db = getDB();
    const question = await db.collection("questions").findOne({ isActive: true });
    if (!question) return null;

    const answers = await db.collection("answers").find({ questionId: question._id.toString() }).toArray();

    const optionsWithVotes = {};
    if (question.options) {
        Object.keys(question.options).forEach(opt => {
            optionsWithVotes[opt] = answers
                .filter(a => a.selectedOption === opt)
                .map(a => a.studentName);
        });
    }

    return { ...question, options: optionsWithVotes, totalVotes: answers.length };
};

const addAnswer = async (questionId, answer) => {
    const db = getDB();
    const question = await db.collection("questions").findOne({ _id: new ObjectId(questionId) });

    if (!question || !question.isActive) {
        throw new Error("Question is not active");
    }

    return db.collection("answers").insertOne({
        questionId: questionId.toString(),
        studentName: answer.studentName,
        selectedOption: answer.selectedOption,
        createdAt: new Date()
    });
};

const fetchQuestions = async () => {
    const db = getDB();
    const questions = await db.collection("questions").find().sort({ createdAt: -1 }).toArray();

    const answers = await db.collection("answers").find().toArray();

    return questions.map(q => {
        const optionsWithVotes = {};
        if (q.options) {
            Object.keys(q.options).forEach(opt => {
                optionsWithVotes[opt] = answers
                    .filter(a => a.questionId.toString() === q._id.toString() && a.selectedOption === opt)
                    .map(a => a.studentName);
            });
        }
        const totalVotes = Object.values(optionsWithVotes).reduce((acc, arr) => acc + arr.length, 0);
        return {
            ...q,
            options: optionsWithVotes,
            totalVotes
        };
    });
};

const fetchQuestionHistory = async (questionId) => {
    const db = getDB();
    const question = await db.collection("questions").findOne({ _id: new ObjectId(questionId) });
    if (!question) return null;

    const answers = await db.collection("answers").find({ questionId: questionId.toString() }).toArray();

    const optionsWithVotes = {};
    if (question.options) {
        Object.keys(question.options).forEach(opt => {
            optionsWithVotes[opt] = answers
                .filter(a => a.selectedOption === opt)
                .map(a => a.studentName);
        });
    }

    return { ...question, options: optionsWithVotes, totalVotes: answers.length };
};

module.exports = { insertQuestion, fetchQuestions, addAnswer, fetchActiveQuestion, fetchQuestionHistory };
