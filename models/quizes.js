const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  easyQuiz: [
    {
      question: String,
      answer: String,
      choices: [String],
      attemtps: {
        type: Number,
        default: 0,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  mediumQuiz: [
    {
      question: String,
      answer: String,
      choices: [String],
      attemtps: {
        type: Number,
        default: 0,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  hardQuiz: [
    {
      question: String,
      answer: String,
      choices: [String],
      attemtps: {
        type: Number,
        default: 0,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
