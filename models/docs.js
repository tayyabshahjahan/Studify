const { number } = require("joi");
const mongoose = require("mongoose");
const quizzes = require("./quizes");
const docSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Learning card must have a title"],
  },
  courseName: {
    type: String,
    required: [true, "Learning card must have a course name"],
  },
  content: {
    type: String,
  },
  summary: {
    type: String,
  },
  tags: {
    type: [String],
  },
  flashCards: {
    front: [String],
    back: [String],
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  isProcessed: {
    type: Boolean,
    default: false,
  },
  quizzesCompleted: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
});

docSchema.post("findOneAndDelete", async (card) => {
  let del = await quizzes.deleteOne({ _id: card.quiz._id });
});

const Doc = mongoose.model("Doc", docSchema);

module.exports = Doc;
