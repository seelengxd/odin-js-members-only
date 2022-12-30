const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const passport = require("passport");

const requireLogin = function (req, res, next) {
  if (!req.user) {
    res.redirect("/users/sign-up");
  }
  next();
};

exports.requireLogin = requireLogin;

exports.signUpGet = function (req, res, next) {
  res.render("sign-up", { errors: [] });
};

exports.signUpPost = [
  body("username")
    .isLength({ min: 5 })
    .withMessage("Username should be at least 5 characters long!"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters long!"),
  body("confirmPassword").custom((confirmPassword, { req }) => {
    if (confirmPassword.valueOf() !== req.body.password.valueOf()) {
      throw new Error("Password confirmation does not match password.");
    }
    return true;
  }),
  body("firstName", "First Name cannot be empty").isLength({ min: 1 }),
  body("lastName", "Last Name cannot be empty").isLength({ min: 1 }),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign-up", { errors: errors.array() });
    }
    User.findOne({ username: req.body.username }, (err, foundUser) => {
      if (err) {
        return next(err);
      }
      if (foundUser) {
        res.render("sign-up", {
          errors: [{ msg: "This username is already taken." }],
        });
        return;
      }
      bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
        new User({
          username: req.body.username,
          password: hashedPassword,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        })
          .save()
          .then((user) => {
            req.logIn(user, (err) => {
              if (err) {
                return next(err);
              }
              res.redirect("/");
            });
          })
          .catch((err) => next(err));
      });
    });
  },
];

exports.logInGet = function (req, res, next) {
  res.render("log-in", {
    errors: req.session.messages ? [{ msg: req.session.messages[0] }] : [],
  });
};

exports.logInPost = [
  passport.authenticate("local", {
    failureRedirect: "/users/log-in",
    failureMessage: true,
  }),
  function (req, res, next) {
    res.redirect("/");
  },
];

exports.logOut = function (req, res, next) {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.memberGet = [
  requireLogin,
  function (req, res, next) {
    res.render("member", { errors: [] });
  },
];

exports.memberPost = [
  requireLogin,
  function (req, res, next) {
    if (req.body.password !== "hunter2") {
      res.render("member", {
        errors: [{ msg: "That is not the secret password!" }],
      });
    }
    User.findByIdAndUpdate(req.user._id, { isMember: true }, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];
