var express = require("express");
var router = express.Router();
const Post = require("../models/post");

/* GET home page. */
router.get("/", function (req, res, next) {
  Post.find({})
    .populate("user")
    .then((posts) => {
      res.render("index", { posts });
    });
});

module.exports = router;
