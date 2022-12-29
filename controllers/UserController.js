const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

exports.signUpGet = function (req, res, next) {
  res.render("sign-up");
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
    console.log(errors);
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
          .then(() => res.redirect("/log-in"))
          .catch((err) => next(err));
      });
    });
  },
];

exports.logIn = function (req, res, next) {
  res.send("Log in, not implemented");
};

exports.logOut = function (req, res, next) {
  res.send("Log out, not implemented");
};
