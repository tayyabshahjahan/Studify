const express = require("express");
const docs = require("../../models/docs");
const quizzes = require("../../models/quizes");
const wrapAsync = require("../../utils/wrapAsync");
const appError = require("../../utils/appError");
const isLoggedIn = require("../../utils/isLoggedIn");
const wrapAsync = require("../../utils/wrapAsync");
const router = express.Router({ mergeParams: true });

router.get(
  "/user/:userId/card/:cardId/quiz",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const { userId, cardId } = req.params;
    const { level } = req.query;
    const levels = ["easy", "medium", "hard"];
    const card = await docs.findById(cardId).populate("quiz");
    if (
      userId == res.locals.currentUser._id &&
      card &&
      levels.includes(level)
    ) {
      res.render("./quizzes/show", { card, level });
    } else {
      throw new appError("Couldnt find what you are looking for ", 404);
    }
  })
);
