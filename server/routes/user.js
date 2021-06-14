const { authJwt } = require("../middlewares");
const controller = require("../controllers/user");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/c/student", [authJwt.verifyToken], controller.studentContent);

  app.get(
    "/api/c/teacher",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.teacherContent
  );

  app.get(
    "/api/c/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminContent
  );
};
