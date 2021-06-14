const db = require("../models");
const ROLES = ["admin", "teacher", "student"];
const User = db.user;

checkDuplicateUsername = (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Failed! Username is already taken!"});
            return;
        }

        next();
    });
};

checkRoleExisted = (req, res, next) => {
    if (req.body.role) {
        if (!ROLES.includes(req.body.role)) {
          res.status(400).send({
            message: "Failed! Role ${req.body.role} does not exist!"
          });
          return;
        }
    }
  
    next();
};
  
const verifySignUp = {
checkDuplicateUsername,
checkRoleExisted
};

module.exports = verifySignUp;
