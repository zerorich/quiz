const mongoose = require("mongoose");

const allowedCategories = [
  "Ijtimoiy_siyosat",
  "Mahalla_va_oila",
  "Tazyiq_va_zoravonlik",
  "Gumanitar_krizislar",
];

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: Number, required: true },
    questionText: { type: String, required: true },
    selectedOptionId: { type: Number, required: true },
    selectedOptionText: { type: String, required: true },
    correctOptionId: { type: Number, required: true },
    correctOptionText: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false },
);

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, enum: allowedCategories, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  answers: { type: [answerSchema], default: [] },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizResult", quizResultSchema);
