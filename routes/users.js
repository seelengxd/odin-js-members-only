var express = require("express");
var router = express.Router();
const UserController = require("../controllers/UserController");

/* GET users listing. */
router.get("/sign-up", UserController.signUpGet);

router.post("/sign-up", UserController.signUpPost);

router.get("/log-in", UserController.logIn);

router.get("/log-out", UserController.logOut);

module.exports = router;
