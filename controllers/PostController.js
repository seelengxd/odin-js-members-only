const UserController = require("./UserController");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");

exports.new = [
  UserController.requireLogin,
  function (req, res, next) {
    res.render("post", { errors: [] });
  },
];

exports.create = [
  UserController.requireLogin,
  body("title", "Title cannot be empty!").isLength({ min: 1 }),
  body("message", "Message cannot be empty!").isLength({ min: 1 }),
  function (req, res, next) {
    new Post({ ...req.body, user: req.user._id })
      .save()
      .then(() => res.redirect("/"))
      .catch((err) => next(err));
  },
];

exports.delete = function (req, res, next) {};
