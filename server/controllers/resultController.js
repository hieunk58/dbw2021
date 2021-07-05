var async = require('async')
var Test = require('../models/test')
var Result = require('../models/result')

// result list
exports.result_list = function (req, res, next) {
    // var test_id = req.body.test_id;
    Result.find()
        .populate('test')
        .sort([['score', 'ascending']])
        .exec(function (err, list_results) {
            if (err) { 
                res.status(500).send({
                    message: "Cannot retrieve test result."
                  });
                return;
            }
            // Successful
            res.send({ result_list: list_results });
        })
};

// result list by student id
exports.student_result_list = function (req, res, next) {
    var student_id = req.body.studentId;

    Result.find({'student': student_id})
        .sort([['score', 'ascending']])
        .populate('subject')
        .exec(function (err, result) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot retrieve test result of this student."
                  });
            }
            res.send({ result_list: result });

            // Result.aggregate(list_results, [{
            //     $group: {
            //         _id: "$subject",
            //         avgScore: {$avg: "$score"}
            //     }
            // }])
            //     .exec(function (err, result) {
            //         if (err) { 
            //             res.status(500).send({
            //                 message:
            //                 err.message || "Cannot retrieve test result of this subject."
            //             });
            //         }
            //     // Successful
            //         res.send({ result_list: result });
            //     })
        })
    //Result.aggregate().match({'student': student_id}).group({_id: "$subject"})
    // Result.aggregate([
    //     {
    //         $match: {'student': student_id}
    //     },
    //     {
    //         $group: {
    //             _id: "$subject",
    //             averageGrade: { $avg: "$score"}
    //         }
    //     }
    // ])
    //     .exec(function(err, result) {
    //         if(err) {
    //             res.status(500).send({
    //                 message: err.message// "Cannot retrieve test result of this student."
    //               });
    //             return;
    //         }
    //         // populate subject
    //         // Result.populate(result, {path: 'subject'});
    //         // Successful
    //         res.send({ result_list: result });
    //     })
};

// Display detail data (student and score) by test id
exports.result_detail = function (req, res, next) {

    async.parallel({
        test: function (callback) {
            Test.findById(req.params.id)
                .exec(callback)
        },
        test_results: function (callback) {
            Result.find({ 'test': req.params.id })
                .exec(callback)
        },

    }, function (err, results) {
        if (err) { 
            res.status(500).send({
                message:
                  err.message || "Cannot retrieve test details."
              });
        }
        if (results.test == null) {
            var err = new Error('Test not found');
            err.status = 404;
            return next(err);
        }
        // Successful
        res.send({ test: results.test, test_results: results.test_results });
    });

};


// Handle update test result on POST.
exports.result_update_post = function (req, res) {
    // update score of each student
    var id = req.params.id;
    var new_score = req.body.new_score;

    Result.findByIdAndUpdate(id, { 'score': new_score })
        .exec(function (err, result) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot update this test result"
                });
            }
            if(!result) {
                res.status(404).send({
                message: "Test result not found"
              });
              return;
            } else {
                res.send({ message: "Result was updated successfully." });
            }
        });
};


// // Handle create test result on POST.
exports.result_create_post = function (req, res) {
    var new_result = new Result({
        test: req.body.testId,
        student: req.body.studentId,
        subject: req.body.subjectId,
        score: req.body.score
    });

    // console.log('create new result test id: ', req.body.testId);
    // console.log('create new result student id: ', req.body.studentId);
    // console.log('create new result subject id: ', req.body.subjectId);
    // console.log('create new result score: ', req.body.score);


    // check create test result 2 times for same student in the same test of 1 subject
    Result.findOne({'test': req.body.testId, 
        'student': req.body.studentId, 
        'subject': req.body.subjectId})
        .exec(function (err, found) {
            if (err) { 
                res.status(500).send({
                    message: "Cannot create test result."
                });
                return;
            }
            if(found) {
                res.status(400).send({
                    message: "Test result for this student is already created."
                });
                return;
            }
            new_result.save(function(err) {
                if(err) {
                    res.status(500).send({
                        message: "Cannot create test result"
                    });
                    return;
                }
                res.send({ message: "Result was created successfully." });
            });
        });
};

exports.result_delete_post = function(req, res) {
    var id = req.params.id;
    
    Result.findByIdAndRemove(id)
        .exec(function (err, found) {
            if (err) { 
                res.status(500).send({
                    message: "Cannot delete this test result"
                });
                return;
            }
            if(!found) {
                res.status(404).send({
                    message: "Test result not found"
                });
                return;
            }
            res.send({ message: "Test result was deleted successfully." });
        });
};
