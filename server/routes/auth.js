var express = require('express');
var router = express.Router();
// Require middleware and auth controller modules
var verifySignUp = require("../middlewares/verifySignUp");
var auth_controller = require("../controllers/authController");

router.post(
    "/signup",
    [
        verifySignUp.checkDuplicateUsername,
        verifySignUp.checkRoleExisted
    ],
    auth_controller.signup
);

router.post("/signin", auth_controller.signin);

module.exports = router;
