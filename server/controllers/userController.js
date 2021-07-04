var bcrypt = require("bcryptjs");
var User = require('../models/user');
var Subject = require('../models/subject');
var Result = require('../models/result');
var Role = require('../models/role');
var Enrollment = require('../models/enrollment');


// Display list of all user
exports.user_list = function (req, res, next) {

    User.find()
        .populate('role')
        .exec(function (err, list_users) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot retrieve user list."
                  });
                return;
            }
            // Successful
            res.send({ title: 'User List', user_list: list_users });
        })

};

exports.user_detail = function (req, res, next) {
    var id = req.params.id;
    User.findById(id)
        .populate('role')
        .exec(function (err, user) {
            if (err) { 
                res.status(500).send({
                    message: "Cannot retrieve user detail."
                  });
                return;
            }
            // Successful
            res.send({ user_detail: user });
        })

};

exports.user_create_post = (req, res) => {
    const user = new User({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    });
  
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (req.body.role) {
        Role.findOne({
            name: req.body.role
          },
          (err, role) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
  
            user.role = role._id;
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
  
              res.send({ message: "User was registered successfully!", role: role.name});
            });
          }
        );
      }
    });
};

// Handle user update on POST.
exports.user_update_post = function (req, res) {

    var id = req.params.id;

    var new_user = new User(
        {
            _id: id, // using old id otherwise this will be new user id
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            role: req.body.role
            // class: (typeof req.body.class==='undefined') ? null : req.body.class
            // role is unchanged, not allowed to change it on form
        }
    )

    User.findByIdAndUpdate(id, new_user )
        .exec(function (err, result) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot update user."
                });
                return;
            }
            
            if(!result) {
                res.status(404).send({
                message: `Cannot update user with id=${id}`
              });
            } else {
                res.send({ message: "Class was updated successfully." });
            }
        });
};

// check user is teacher or student
exports.user_delete_post = function(req, res) {
    var id = req.params.id;
    var msg = "";
    
    User.findById(id)
        .populate('role')
        .exec(function(err, found_user) {
            if(err) {
                res.status(500).send({
                    message: "Cannot delete user. User not found"
                });
                return;
            }
            // found, next is check role
            if(!found_user) {
                res.status(500).send({
                    message: "Cannot delete user. User not found"
                });
                return;
            }
            var role = found_user.role;
            console.log("delete user with role: ", role);
            console.log("delete user with id: ", id);
            if(role.name === "teacher") {
                console.log("role is teacher");
                // if teacher is assigned at least one subject that not archived -> cannot remove
                Subject.findOne({'teacher': id, 'isArchived': false})
                    .exec(function(err, found_one) {
                        if(err) {
                            res.status(500).send({
                                message: "Cannot delete this teacher."
                            });
                            return;
                        }
                        if(found_one) {
                            console.log("found a teacher has 1 subject not archived: ", found_one);
                            res.status(500).send({
                                message: 'Cannot delete teacher has dependent subjects'
                            });
                            return;
                        }
                        else {
                            // delete normally
                            msg = deleteUser(id);
                            res.send({message: msg});
                        }
                    });
    
            } else if(role.name === "student") {
                // delete all test results
                // STUDENT find all test result that have user id = deleted user id
                Result.deleteMany({student: id})
                    .exec(function(err) {
                        if(err) {
                            res.status(500).send({
                                message: 'Cannot delete this user'
                            });
                            return;
                        }
                    })
                // delete enrollment {class, student}
                console.log("remove student with id: ", id);
                Enrollment.findOneAndRemove({'student': id})
                    .exec(function(err) {
                        if(err) {
                            res.status(500).send({
                                message: 'Cannot delete this user'
                            });
                        }
                        // deleteUser(id);
                        msg = deleteUser(id);
                        res.send({message: msg});
                    })
            } else {
                // admin, delete normally
                // deleteUser(id);
                msg = deleteUser(id);
                res.send({message: msg});
            }
        });
};

function deleteUser(id) {
    var msg = "";
    User.findByIdAndRemove(id)
            .exec(function (err, result) {
                if (err) { 
                    // res.status(500).send({
                    //     message: "Cannot delete user. User not found"
                    // });
                    msg = "Cannot delete user. User not found";
                    return msg;
                }
                if(!result) {
                    // res.status(404).send({
                    // message: `Cannot delete user with id=${id}`
                    msg = "Cannot delete this user";
                    return msg;
                } else {
                    msg = "User was deleted successfully."
                    // res.send({ message: "User was deleted successfully." });
                }
            });
    return msg;
}