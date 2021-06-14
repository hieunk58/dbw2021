var express = require('express');
var router = express.Router();

const { authJwt } = require("../middlewares");
const user_controller = require("../controllers/userController");

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/c/student", [authJwt.verifyToken], user_controller.studentContent);

router.get(
  "/c/teacher",
  [authJwt.verifyToken, authJwt.isTeacher],
  user_controller.teacherContent
);

router.get(
  "/c/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  user_controller.adminContent
);

module.exports = router;
