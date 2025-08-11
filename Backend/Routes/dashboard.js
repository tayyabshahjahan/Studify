const express = require("express");
const router = express.Router({ mergeParams: true });
const docs = require("../../models/docs");
const users = require("../../models/users");
const wrapAsync = require("../../utils/wrapAsync");
const appError = require("../../utils/appError");
const joi = require("joi");
const isLoggedIn = require("../../utils/isLoggedIn");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const officeParser = require("officeparser");
const {
  getQuiz,
  getFlashCards,
  getSummary,
} = require("../../utils/parseContent");
const quizes = require("../../models/quizes");

const checkQuiz = async (level, id, ans, noCompleted) => {
  const answers = [];
  let newComplete = false;
  let card = await docs.findById(id).populate("quiz");
  let quizId = card.quiz._id;
  let tempQuiz = await quizes.findById(quizId);

  for (let i = 0; i < 5; i++) {
    if (level == "easy") {
      quiz = tempQuiz.easyQuiz;
      const questionId = quiz[i]._id;
      if (quiz[i].isCompleted === false) {
        await quizes.updateOne(
          { _id: quizId, "easyQuiz._id": questionId },
          { $set: { "easyQuiz.$.isCompleted": true } }
        );
        newComplete = true;
      }
      if (quiz[i].answer.trim() == ans[`easy-${i}`]) {
        answers.push(1);
      } else {
        answers.push(0);
      }
    }
    if (level == "medium") {
      quiz = tempQuiz.mediumQuiz;
      const questionId = quiz[i]._id;
      if (quiz[i].isCompleted === false) {
        await quizes.updateOne(
          { _id: quizId, "mediumQuiz._id": questionId },
          { $set: { "mediumQuiz.$.isCompleted": true } }
        );
        newComplete = true;
      }
      if (quiz[i].answer.trim() == ans[`medium-${i}`]) {
        answers.push(1);
      } else {
        answers.push(0);
      }
    }
    if (level == "hard") {
      quiz = tempQuiz.hardQuiz;
      const questionId = quiz[i]._id;
      if (quiz[i].isCompleted === false) {
        await quizes.updateOne(
          { _id: quizId, "hardQuiz._id": questionId },
          { $set: { "hardQuiz.$.isCompleted": true } }
        );
        newComplete = true;
      }
      if (quiz[i].answer.trim() == ans[`hard-${i}`]) {
        answers.push(1);
      } else {
        answers.push(0);
      }
    }
  }
  if (newComplete === true) {
    noCompleted++;
    await docs.findByIdAndUpdate(id, { quizzesCompleted: noCompleted });
  }
  return answers;
};

const validataData = (body) => {
  const docSchema = joi.object({
    title: joi.string().required(),
    courseName: joi.string().required(),
  });
  const { error } = docSchema.validate(body);
  return error;
};

const parsePpt = async (doc) => {
  const buffer = fs.readFileSync(doc.path);
  try {
    data = await officeParser.parseOfficeAsync(buffer);
    return data;
  } catch (e) {
    return e;
  }
};

const parseWord = async (doc) => {
  const buffer = fs.readFileSync(doc.path);
  try {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  } catch (e) {
    return e;
  }
};
const parsePdf = async (doc) => {
  const buffer = fs.readFileSync(doc.path);
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (e) {
    return e;
  }
};

const sendToParser = async (ext, doc) => {
  let data;
  if (ext == ".pdf") {
    data = await parsePdf(doc);
    return data;
  } else if (ext == ".docx") {
    data = await parseWord(doc);
    return data;
  } else if (ext == ".pptx") {
    data = await parsePpt(doc);
    return data;
  }
};

const saveQuiz = async (data, user) => {
  try {
    let eArr = [],
      mArr = [],
      hArr = [];
    const {
      easyQuestions,
      mediumQuestions,
      hardQuestions,
      easyQChoices,
      mediumQchoices,
      hardQchoices,
      easyAns,
      mediumAns,
      hardAns,
    } = await getQuiz(data);
    for (let i = 0; i < 5; i++) {
      const tempE = {
        question: easyQuestions[i],
        answer: easyAns[i],
        choices: easyQChoices[i],
      };
      eArr.push(tempE);
      const tempM = {
        question: mediumQuestions[i],
        answer: mediumAns[i],
        choices: mediumQchoices[i],
      };
      mArr.push(tempM);
      const tempH = {
        question: hardQuestions[i],
        answer: hardAns[i],
        choices: hardQchoices[i],
      };
      hArr.push(tempH);
    }
    console.log(eArr, hArr, mArr);
    const quiz = new quizes({
      easyQuiz: eArr,
      mediumQuiz: mArr,
      hardQuiz: hArr,
    });
    quiz.user = user;
    const savedQuiz = await quiz.save();
    return savedQuiz;
  } catch (e) {
    throw new appError();
  }
};

router.get(
  "/:userId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { userId } = req.params;
    const { card } = req.query;
    const user = await users.findById(userId);
    if (user) {
      if (card && card == "completed") {
        const allDocs = await docs.find({ user: userId, quizzesCompleted: 3 });
        res.render("./dashboard/home", { user, allDocs });
      } else if (card && card == "notCompleted") {
        const allDocs = await docs.find({
          user: userId,
          quizzesCompleted: { $ne: 3 },
        });
        res.render("./dashboard/home", { user, allDocs });
      } else {
        const allDocs = await docs.find({ user: userId });
        res.render("./dashboard/home", { user, allDocs });
      }
    } else {
      throw new appError("Couldnt find user", 404);
    }
  })
);
router.get(
  "/:userId/card/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await users.findById(userId);
    if (user) {
      res.render("./dashboard/new", { user });
    } else {
      throw new appError("Couldnt find user", 404);
    }
  })
);

router.post(
  "/:userId/card",
  isLoggedIn,
  upload.single("document"),
  wrapAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await users.findById(userId);
    if (user) {
      const error = validataData(req.body);
      if (!error) {
        const { title, courseName } = req.body;
        const document = req.file;
        const ext = path.extname(document.originalname);
        const data = await sendToParser(ext, document);
        const sum = await getSummary(data);
        const { flashQ, flashA } = await getFlashCards(data);
        const savedQuiz = await saveQuiz(data, user);
        const newDoc = new docs({
          title,
          courseName,
          content: data,
          summary: sum,
          flashCards: {
            front: flashQ,
            back: flashA,
          },
        });
        newDoc.user = user;
        newDoc.quiz = savedQuiz;
        await newDoc.save();
        req.flash("succses", "Made a new Card");
        res.redirect(`/user/${userId}`);
      } else {
        throw new appError(error.details.message);
      }
    } else {
      throw new appError("Couldnt find user", 404);
    }
  })
);

router.get(
  "/:userId/card/:docId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { userId, docId } = req.params;
    const user = await users.findById(userId);
    const doc = await docs.findById(docId).populate("quiz");
    if (user && doc) {
      res.render("./dashboard/show", {
        user,
        doc,
      });
    } else {
      throw new appError("Couldnt find what you were looking for ", 404);
    }
  })
);

router.get(
  "/:userId/card/:cardId/quiz",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const { userId, cardId } = req.params;
    const { level } = req.query;
    const levels = ["easy", "medium", "hard"];
    const card = await docs.findById(cardId).populate("quiz");
    const answers = req.session.answers;
    delete req.session.answers;
    if (
      userId == res.locals.currentUser._id &&
      card &&
      levels.includes(level)
    ) {
      res.render("./dashboard/showQuizes", {
        card,
        level,
        answers: answers || null,
      });
    } else {
      throw new appError("Couldnt find what you are looking for ", 404);
    }
  })
);
router.post(
  "/:userId/card/:cardId/quiz",
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
      const ans = req.body;
      req.session.answers = await checkQuiz(
        level,
        cardId,
        ans,
        card.quizzesCompleted
      );
      console.log(card.quizzesCompleted);
      res.redirect(`/user/${userId}/card/${cardId}/quiz?level=${level}`);
    } else {
      throw new appError("Couldnt find what you are looking for", 404);
    }
  })
);
router.get(
  "/:userId/card/:cardId/flashCards",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const { userId, cardId } = req.params;
    const card = await docs.findById(cardId);
    if (userId == res.locals.currentUser._id && card) {
      res.render("./dashboard/showFlashCards", { card });
    } else {
      throw new appError("Couldnt find what you are looking for ", 404);
    }
  })
);

router.delete(
  "/:userId/card/:cardId",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const { userId, cardId } = req.params;
    const card = await docs.findById(cardId);
    if (userId == res.locals.currentUser._id && card) {
      const crd = await docs.findByIdAndDelete(cardId);
      res.redirect(`/user/${userId}`);
    }
  })
);
module.exports = router;
