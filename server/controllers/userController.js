var bcrypt = require("bcryptjs");
var User = require('../models/user');
var Subject = require('../models/subject');
var Result = require('../models/result');

// Display list of all user
exports.user_list = function (req, res, next) {

    User.find()
        .sort([['role', 'ascending']])
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

exports.user_create_post = (req, res) => {
    const user = new User({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      class: null
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
            first_name: req.body.user_name,
            family_name: req.body.family_name,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            class: (typeof req.body.class==='undefined') ? null : req.body.class
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
    var role = req.body.role;
    
    
    User.findById(id)
        .exec(function(err, found_user) {
            if(err) {
                return;
            }
            // found, next is check role
        });
    // skip find role, assume it is valid =))

    if(role) {
        if(role.name == "teacher") {
            // if teacher is assigned at least one subject that not archived -> cannot remove
            Subject.findOne({teacher: id, isArchived: false})
                .exec(function(err, found_one) {
                    if(err) {
                        res.status(500).send({
                            message: "Cannot delete this teacher."
                        });
                        return;
                    }
                    if(found_one) {
                        res.status(500).send({
                            message: 'Cannot delete this teacher. Teacher is assigned at least one subject that is not archived'
                        });
                        return;
                    }
                });

        } else if(role.name == "student") {
            // delete all test results
            // STUDENT find all test result that have user id = deleted user id
            Result.deleteMany({student: id});
        } else {
            // admin, delete normally
        }

    } else {
        // role is invalid
        res.status(500).send({
            message: "Cannot delete user. Role is invalid"
        });
        return;
    }
    
    // find by id and remove
    User.findByIdAndRemove(id)
        .exec(function (err, result) {
            if (err) { 
                res.status(500).send({
                    message:
                    err.message || "Cannot delete user. Class not found"
                });
                return;
            }
            if(!result) {
                res.status(404).send({
                message: `Cannot delete user with id=${id}`
            });
            } else {
                res.send({ message: "Class was deleted successfully." });
            }
        });
};

exports.user_create_post = function(req, res) {
    var user_name = req.body.user_name;
    var new_user = new Class({ user_name: user_name });

    User.findOne({ 'user_name': user_name })
        .exec(function(err, found_user) {
            if(err) {
                res.status(500).send({
                    message:
                    err.message || "Cannot create new user."
                });
                return;
            }
            if(found_user) {
                res.status(400).send({
                    message:
                    err.message || 'Class with name=${user_name} is already existed.'
                });
                return;
            }
            else {
                new_user.save(function(err) {
                    if(err) {
                        res.status(500).send({
                            message:
                            err.message || "Cannot create new user."
                        });
                    }
                    res.send({ message: "Class was created successfully." });
                });
            }
        });
};

