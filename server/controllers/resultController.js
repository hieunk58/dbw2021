var async = require('async')
var Test = require('../models/test')
var Result = require('../models/result')

// result list by test id
exports.result_list = function (req, res, next) {
    var test_id = req.body.test_id;

    Result.find({'test': test_id})
        .sort([['score', 'ascending']])
        .exec(function (err, list_results) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot retrieve test result of this subject."
                  });
            }
            // Successful
            res.send({ result_list: list_results });
        })
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
                      err.message || "Cannot update this test result."
                });
            }
            if(!result) {
                res.status(404).send({
                message: `Cannot update test result with id=${id}`
              });
            } else {
                res.send({ message: "Test result was updated successfully." });
            }
        });
};
