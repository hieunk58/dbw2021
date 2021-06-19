// var Class = require('../models/class')
var async = require('async')
// var Student = require('../models/user') // user with role="student"
// var User = require('../models/user') // user with role="student", role="teacher"
var Subject = require('../models/subject')
var Result = require('../models/result')


// Display list of all subjects
exports.subject_list = function (req, res, next) {

    Subject.find()
        .sort([['subject_name', 'ascending']])
        .exec(function (err, list_subjects) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot retrieve subject list."
                  });
                return;
            }
            // Successful
            res.send({subject_list: list_subjects });
        })

};

// Display subject detail (show all test list)
exports.subject_detail = function (req, res, next) {
    async.parallel({
        suject: function(callback) {
            Subject.findById(id).exec(callback);
        },
        // find all test that have subject id = subject id
        test_list: function(callback) {
            Test.find({ 'subject': id }).exec(callback);
        },
        
    }, function(err, results) {
        if(err) {
            res.status(500).send({
                message:
                err.message || "Cannot get detail of this subject"
            });
            return;
        }
        res.send({list_test: test_list});
});
    // Subject.find()
    //     .sort([['subject_name', 'ascending']])
    //     .exec(function (err, list_subjects) {
    //         if (err) { 
    //             res.status(500).send({
    //                 message:
    //                   err.message || "Cannot retrieve subject list."
    //               });
    //             return;
    //         }
    //         // Successful
    //         res.send({subject_list: list_subjects });
    //     })

};

// Handle subject update name and assigned teacher on POST.
exports.subject_update_post = function (req, res) {

    var id = req.params.id;
    var new_name = req.body.subject_name;
    var new_teacher = req.body.teacher;

    Subject.findByIdAndUpdate(id, { subject_name: new_name, teacher: new_teacher } )
        .exec(function (err, result) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot update subject."
                });
                return;
            }
            if(!result) {
                res.status(404).send({
                message: `Cannot update subject with id=${id}`
              });
            } else {
                res.send({ message: "Subject was updated successfully." });
            }
        });
};

exports.subject_delete_post = function(req, res) {
    // only subject has no test can be deleted
    var id = req.params.id;

    async.parallel({
        suject: function(callback) {
            Subject.findById(id).exec(callback);
        },
        // find all test that have subject id = deleted subject id
        test_list: function(callback) {
            Test.find({ 'subject': id }).exec(callback);
        },
        
    }, function(err, results) {
        if(err) {
            res.status(500).send({
                message:
                err.message || "Cannot delete subject. Subject not found"
            });
            return;
        }
 
        if(results.test_list.length == 0)
        {
            Subject.findByIdAndRemove(id)
                .exec(function (err) {
                    if (err) { 
                        res.status(500).send({
                            message:
                            err.message || "Cannot delete subject. Subject not found"
                        });
                        return;
                    }
                    res.send({ message: "Subject was deleted successfully." });
            });
        } else {
            res.status(500).send({
                message: "Cannot delete. This subject has dependent test."
            });
        }
    });
};

exports.subject_create_post = function(req, res) {
    var subject_name = req.body.subject_name;
    var assigned_teacher = req.body.teacher;
    var new_subject = new Subject({ subject_name: subject_name, teacher: assigned_teacher});

    Subject.findOne({'subject_name': subject_name })
        .exec(function(err, found_subject) {
            if(err) {
                res.status(500).send({
                    message:
                    err.message || "Cannot create new subject."
                });
                return;
            }
            if(found_subject) {
                res.status(400).send({
                    message:
                    err.message || 'Subject with name=${subject_name} is already existed.'
                });
                return;
            }
            else {
                new_subject.save(function(err) {
                    if(err) {
                        res.status(500).send({
                            message:
                            err.message || "Cannot create new subject."
                        });
                        return;
                    }
                    res.send({ message: "Subject was created successfully." });
                });
            }
        });
};

// handle admin archive a subject
exports.subject_archive_post = function(req, res) {
    var id = req.params.id;
    // only subject has at least 1 test can be archived
    Test.findOne({'subject': id})
        .exec(function(err, found_one) {
            if(err) {
                res.status(500).send({
                    message:
                    err.message || "Cannot archive this subject."
                });
                return;
            }
        });
    Subject.findByIdAndUpdate(id, {'isArchived': true})
        .exec(function(err) {
            if(err) {
                res.status(500).send({
                    message:
                    err.message || "Subject not found."
                });
                return;
            }
            // successful
            res.send({ message: "Subject was archived successfully." });
        });
};

// handle admin add subject 