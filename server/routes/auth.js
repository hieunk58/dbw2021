var express = require('express');
var router = express.Router();
// Require middleware and auth controller modules
var verifySignUp = require("../middlewares/verifySignUp");
var auth_controller = require("../controllers/authController");
var user_controller = require("../controllers/userController");

router.post(
    "/user/create",
    [
        verifySignUp.checkDuplicateUsername,
        verifySignUp.checkRoleExisted
    ],
    user_controller.user_create_post
);

router.post("/signin", auth_controller.signin);

module.exports = router;
