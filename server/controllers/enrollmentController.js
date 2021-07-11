var Class = require('../models/class')
var async = require('async')
var User = require('../models/user') // user with role="student"
var Enrollment = require('../models/enrollment')
var Role = require('../models/role')
var Result = require('../models/result')

exports.class_student_get = function(req, res) {
    var classId = req.params.id;
    
    Enrollment.find({'class': classId})
        .populate('student')
        .exec(function(err, result) {
            if(err) {
                res.status(500).send({
                    message: "Cannot get enrollment information"
                });
                return;
            }
            res.send({list_student: result}); // each element is {class, student}
        })
}

exports.enrollment_list = function(req, res) {
    Enrollment.find()
    .populate('student')
        .exec(function(err, result) {
            if(err) {
                res.status(500).send({
                    message: "Cannot get enrollment information"
                });
                return;
            }
            if(result) {
                res.send({list: result}); // each element is {class, student}
            }
        })
}

exports.student_enrollment_get = function(req, res) {
    var studentId = req.body.studentId;
    console.log("studentId: ", studentId);

    
    Enrollment.findOne({'student': studentId})
        .exec(function(err, result) {
            if(err) {
                res.status(500).send({
                    message: "Cannot get enrollment information"
                });
                return;
            }
            if(result) {
                res.send({result}); // each element is {class, student}
            }
        })
}

exports.register_student_post = function(req, res) {
    var classId = req.body.class;
    var studentId = req.body.student;
    var new_enrollment = new Enrollment({ 'class': classId, 'student': studentId });

    Enrollment.findOneAndDelete({ 'student': studentId })
        .exec(function(err, found) {
            if(err) {
                res.status(500).send({
                    message: "Cannot add student to this class."
                });
                return;
            }
            if(found) {
                // when deregister a student, remove all test results belong to that student
                Result.deleteMany({'student': found.student})
                    .exec(function(err) {
                        if(err) {
                            res.status(500).send({
                                message: "Cannot deregister this student"
                            });
                            return;
                        }
                    });
            }
            // delete previous one successfully, save new one
            new_enrollment.save(function(err) {
                if(err) {
                    res.status(500).send({
                        message: "Cannot add student to this class"
                    });
                    return;
                }
                res.send({ message: "Student was added successfully." });
            });

            // if(found_one) {
                // if student already in one class, update new class
                // Enrollment.findOneAndUpdate({'student': studentId}, {'class': classId})
                // .exec(function(err) {
                //     if(err) {
                //         res.status(500).send({
                //             // message: "Cannot add student to this class"
                //             message: "FUCK"
                //         });
                //         return;
                //     }
                //     res.send({ message: "Student was added successfully." });
                // })
                // Enrollment.findOneAndRemove({'student': studentId});
            // }
            // else {
                // new_enrollment.save(function(err) {
                //     if(err) {
                //         res.status(500).send({
                //             message: "Cannot add student to this class"
                //         });
                //     }
                //     res.send({ message: "Student was added successfully." });
                // });
            // }
        });

       
};

exports.deregister_student_post = function(req, res) {
    var id = req.body.id;

    Enrollment.findByIdAndRemove(id)
        .exec(function(err, found) {
            if(err) {
                res.status(500).send({
                    message: "Cannot deregister this student"
                });
                return;
            }
            if(found) {
                // when deregister a student, remove all test results belong to that student
                Result.deleteMany({'student': found.student})
                    .exec(function(err) {
                        if(err) {
                            res.status(500).send({
                                message: "Cannot deregister this student"
                            });
                            return;
                        }
                    });
            }
            res.send({ message: "Deregister student successfully." });
        });
};