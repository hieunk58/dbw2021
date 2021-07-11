var Class = require('../models/class')
var async = require('async')
var User = require('../models/user') // user with role="student"
var Subject = require('../models/subject')
var Test = require('../models/test')
var Result = require('../models/result')
var Enrollment = require('../models/enrollment')

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
            res.send({ class_list: list_classes });
        })

};

// Display detail data (student and subject list) for a specific Class.
exports.class_detail = function (req, res, next) {

    async.parallel({
        class: function (callback) {
            Class.findById(req.params.id)
                .exec(callback)
        },

        class_subjects: function (callback) {
            Subject.find({ 'class': req.params.id })
                .populate('teacher')
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
        res.send({ class: results.class,
            subject_list: results.class_subjects });
    });

};

// Handle Class update name on POST.
exports.class_update_post = function (req, res) {

    var id = req.params.id;
    var new_name = req.body.class_name;
    Class.findByIdAndUpdate(id, { 'class_name': new_name} )
        .exec(function (err, result) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot update this class."
                });
                return;
            }
            if(!result) {
                res.status(404).send({
                message: "Class not found"
              });
            } else {
                res.send({ message: "Class was updated successfully." });
            }
        });
};

exports.class_delete_post = function(req, res) {
    var id = req.params.id;
    // to delete a class:
    // 1. delete subject(non-archived), test, test result
    // 2. delete enrollment
    async.parallel({
        class: function(callback) {
            Class.findById(id).exec(callback);
        },
        subject_list: function(callback) {
            Subject.find({ 'class': id, "isArchived": false}).exec(callback);
        }
    }, function(err, results) {
        if(err) {
            res.status(500).send({
                message:
                err.message || "Cannot delete class. Class not found"
            });
            return;
        }

        // 1. delete subject, test, test results
        if(results.subject_list.length > 0) {
            for(let i = 0; i < results.subject_list.length; ++i) {
                // delete all test have subject id
                console.log("delete subject.id: ", results.subject_list[i]._id);
                console.log("delete subject.name: ", results.subject_list[i].subject_name);
                Test.deleteMany({'subject': results.subject_list[i]._id})
                .exec(function(err) {
                    if(err) {
                        res.status(500).send({
                            message:
                            err.message || "Cannot delete class."
                        });
                        return;
                    }
                });
            
                // delete all test results have subject id
                Result.deleteMany({'subject': results.subject_list[i]._id})
                .exec(function(err) {
                    if(err) {
                        res.status(500).send({
                            message:
                            err.message || "Cannot delete class."
                        });
                        return;
                    }
                });
            }
        }
        // 2. delete enrollment
        Enrollment.deleteMany({'class': id})
        .exec(function(err) {
            if(err) {
                res.status(500).send({
                    message:
                    err.message || "Cannot delete class."
                });
                return;
            }
        });

        Class.findByIdAndRemove(id)
        .exec(function (err) {
            if (err) { 
                res.status(500).send({
                    message:
                    err.message || "Cannot delete class. Class not found"
                });
                return;
            }
            res.send({ message: "Class was deleted successfully." });
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
                    message: "Cannot create new class."
                });
                return;
            }
            if(found_class) {
                res.status(400).send({
                    message: `Class with name ${class_name} is already existed.`
                });
            }
            else {
                new_class.save(function(err) {
                    if(err) {
                        res.status(500).send({
                            message: "Cannot create new class."
                        });
                    }
                    res.send({ message: "Class was created successfully." });
                });
            }
        });
};
