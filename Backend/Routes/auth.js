const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../../models/users");
const appError = require("../../utils/appError");
const wrapAsync = require("../../utils/wrapAsync");
const joi = require("joi");

const validataData = (body) => {
  const userSchema = joi.object({
    username: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
  });
  const { error } = userSchema.validate(body);
  return error;
};

router.get("/signUp", (req, res) => {
  res.render("./auth/signUp");
});

router.post(
  "/signUp",
  wrapAsync(async (req, res, next) => {
    const error = validataData(req.body);
    try {
      if (error) {
        const msg = error.details.map((er) => er.message).join(",");
        console.log(msg);
      } else {
        const { lastName, firstName, username, email, password } = req.body;
        const user = new users({ lastName, firstName, username, email });
        const newUser = await users.register(user, password);
        req.flash("success", "Successfully signed up! Please log in.");
        res.redirect("/login");
      }
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("./auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Successefly Logged In");
    const id = req.user._id;
    res.redirect(`/user/${id}`);
  }
);

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      throw new appError("Couldnt log out");
    }
  });
  req.flash("success", "GoodBye!");
  res.redirect("/");
});
module.exports = router;
