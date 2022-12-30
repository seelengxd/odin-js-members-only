const UserController = require("./UserController");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");

exports.new = [
  UserController.requireLogin,
  function (req, res, next) {
    res.render("post", { errors: [], post: null });
  },
];

exports.create = [
  UserController.requireLogin,
  body("title", "Title cannot be empty!").isLength({ min: 1 }),
  body("message", "Message cannot be empty!").isLength({ min: 1 }),
  function (req, res, next) {
    const post = new Post({ ...req.body, user: req.user._id });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("post", { errors: errors.array(), post });
    }
    post
      .save()
      .then(() => res.redirect("/"))
      .catch((err) => next(err));
  },
];

exports.delete = [
  UserController.requireAdmin,
  function (req, res, next) {
    Post.findByIdAndRemove(req.params.id, (err, deletedPost) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];
