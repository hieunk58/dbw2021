var Class = require('../models/class')
var async = require('async')
var User = require('../models/user') // user with role="student"
var Subject = require('../models/subject')

// const { body,validationResult } = require("express-validator");

// Display list of all classes.
exports.class_list = function (req, res, next) {

    Class.find()
        .sort([['class_name', 'ascending']])
        .exec(function (err, list_classes) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot retrieve class list."
                });
                return;
            }
            // Successful
            res.send({ title: 'Class List', class_list: list_classes });
        })

};

// Display detail data (student and subject list) for a specific Class.
exports.class_detail = function (req, res, next) {

    async.parallel({
        class: function (callback) {
            Class.findById(req.params.id)
                .exec(callback)
        },
        class_students: function (callback) {
            User.find({ 'class': req.params.id, 'role': "student" })
                .exec(callback)
        },
        class_subjects: function (callback) {
            Subject.find({ 'class': req.params.id })
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { 
            res.status(500).send({
                message:
                  err.message || "Cannot retrieve class details."
            });
            return;
        }
        if (results.class == null) { // No results.
            var err = new Error('Class not found');
            err.status = 404;
            return next(err);
        }
        // Successful
        res.send({ class: results.class, student_list: results.classs_students, 
            subject_list: results.class_subjects });
    });

};

// Handle Class update name on POST.
exports.class_update_post = function (req, res) {

    var id = req.params.id;
    var new_name = req.body.class_name;
    Class.findByIdAndUpdate(id, { class_name: new_name} )
        .exec(function (err, result) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot update class."
                });
                return;
            }
            if(!result) {
                res.status(404).send({
                message: `Cannot update class with id=${id}`
              });
            } else {
                res.send({ message: "Class was updated successfully." });
            }
        });
};

exports.class_delete_post = function(req, res) {
    var id = req.params.id;
    async.parallel({
        class: function(callback) {
            Class.findById(id).exec(callback);
        },
        // find all students that have class id = deleted class id
        student_list: function(callback) {
            User.find({ 'class': id, 'role': "student" }).exec(callback);
        },
        subject_list: function(callback) {
            Subject.find({ 'class': id, "isArchived": false})
        }
        // TODO delete subjects
    }, function(err, results) {
        if(err) {
            res.status(500).send({
                message:
                err.message || "Cannot delete class. Class not found"
            });
            return;
        }
        // // deassign student from this class, need to do this? or it automatically null
        // for(let i = 0; i < results.student_list.length; ++i) {
        //     results.student_list[i].class = null;
        // }
        // delete subject if it is not archived and has no test
        for(let i = 0; i < results.subject_list.length; ++i) {
            Test.findOne({'subject': results.subject_list[i]._id})
                .exec(function(err, found_one) {
                    if(err) {
                        res.status(500).send({
                            message:
                            err.message || "Cannot delete class."
                        });
                        return;
                    }
                    if(!found_one) {
                        // only delete subject that has no test
                        Subject.findByIdAndRemove(results.subject_list[i]._id);
                    }
                });
        }

        Class.findByIdAndRemove(id)
            .exec(function (err, result) {
                if (err) { 
                    res.status(500).send({
                        message:
                        err.message || "Cannot delete class. Class not found"
                    });
                }
                if(!result) {
                    res.status(404).send({
                    message: `Cannot delete class with id=${id}`
                });
                } else {
                    res.send({ message: "Class was deleted successfully." });
                }
            });
    });
};

exports.class_create_post = function(req, res) {
    var class_name = req.body.class_name;
    var new_class = new Class({ class_name: class_name });

    Class.findOne({ 'class_name': class_name })
        .exec(function(err, found_class) {
            if(err) {
                res.status(500).send({
                    message:
                    err.message || "Cannot create new class."
                });
                return;
            }
            if(found_class) {
                res.status(400).send({
                    message:
                    err.message || 'Class with name=${class_name} is already existed.'
                });
            }
            else {
                new_class.save(function(err) {
                    if(err) {
                        res.status(500).send({
                            message:
                            err.message || "Cannot create new class."
                        });
                    }
                    res.send({ message: "Class was created successfully." });
                });
            }
        });
};
