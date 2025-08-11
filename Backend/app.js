const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const localStratergy = require("passport-local");
const users = require("../models/users");
const authRoutes = require("./Routes/auth");
const dashboardRoutes = require("./Routes/dashboard");
const homeRoute = require("./Routes/home");
const path = require("path");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const appError = require("./../utils/appError");

mongoose
  .connect("mongodb://127.0.0.1:27017/StudifyDb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "frontEnd", "views"));

app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use(methodOverride("_method"));

const intialiseSession = {
  secret: "willchangeitsoon",
  resave: false,
  saveUninitialized: false,
};

app.use(session(intialiseSession));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

app.use(express.urlencoded({ extended: true }));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.listen(3000, () => {
  console.log("Working on 3000");
});

app.use("/", homeRoute);
app.use("/", authRoutes);
app.use("/user", dashboardRoutes);

app.use((err, req, res, next) => {
  const { message, status = 500 } = err;
  res.render("./error/error", { message, status });
});

app.use((req, res, next) => {
  res.status(404).render("./error/error", {
    status: 404,
    message: "Page Not Found",
  });
});
