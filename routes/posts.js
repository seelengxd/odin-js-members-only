const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");

router.get("/new", PostController.new);

router.post("/", PostController.create);

router.get("/:id", PostController.delete);

module.exports = router;
