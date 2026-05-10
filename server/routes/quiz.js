const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const QuizResult = require("../models/QuizResult");

const router = express.Router();

router.post("/results", isAuthenticated, async (req, res) => {
  try {
    const { category, answers } = req.body;

    if (!category || !Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ message: "category and answers are required" });
    }

    const normalizedAnswers = answers.map((answer) => {
      const isCorrect =
        answer.selectedOptionId === answer.correctOptionId ||
        Boolean(answer.isCorrect);

      return {
        questionId: Number(answer.questionId),
        questionText: String(answer.questionText || ""),
        selectedOptionId: Number(answer.selectedOptionId),
        selectedOptionText: String(answer.selectedOptionText || ""),
        correctOptionId: Number(answer.correctOptionId),
        correctOptionText: String(answer.correctOptionText || ""),
        isCorrect,
      };
    });

    const totalQuestions = normalizedAnswers.length;
    const correctAnswers = normalizedAnswers.filter((a) => a.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;

    const result = await QuizResult.create({
      userId: req.user._id,
      category,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      answers: normalizedAnswers,
    });

    return res.status(201).json({
      result,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save result", error });
  }
});

router.get("/results", isAuthenticated, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id }).sort({
      completedAt: -1,
    });
    return res.json({ results });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch results", error });
  }
});

router.get("/results/:id", isAuthenticated, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch result", error });
  }
});

module.exports = router;
