var Test = require('../models/test')
var async = require('async')
var Test = require('../models/test')
var Result = require('../models/result')

// Display list of all test by subject id
exports.test_list = function (req, res, next) {
    var subject_id = req.body.subject_id;

    Test.find({'subject': subject_id})
        .sort([['test_name', 'ascending']])
        .exec(function (err, list_tests) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot retrieve test of this subject."
                  });
                return;
            }
            // Successful
            res.send({ test_list: list_tests });
        })
};

// Display detail data (student and score) for a specific test.
exports.test_detail = function (req, res, next) {

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
            return;
        }
        if (results.test == null) { // No results.
            var err = new Error('Test not found');
            err.status = 404;
            return next(err);
        }
        // Successful
        res.send({ test: results.test, test_results: results.test_results });
    });

};

// Handle test update name, date on POST.
exports.test_update_post = function (req, res) {

    var id = req.params.id;
    var new_name = req.body.test_name;
    var new_date = req.body.test_date;

    Test.findByIdAndUpdate(id, { test_name: new_name, test_date: new_date})
        .exec(function (err, result) {
            if (err) { 
                res.status(500).send({
                    message:
                      err.message || "Cannot update this test."
                });
                return;
            }
            if(!result) {
                res.status(404).send({
                message: `Cannot update test with id=${id}`
              });
            } else {
                res.send({ message: "Test was updated successfully." });
            }
        });
};

exports.test_delete_post = function(req, res) {
    // delete test and all related test results
    var id = req.params.id;
    
    Test.findByIdAndRemove(id)
        .exec(function (err, result) {
            if (err) { 
                res.status(500).send({
                    message:
                    err.message || "Cannot delete test. Test not found"
                });
                return;
            }
            if(!result) {
                res.status(404).send({
                message: `Cannot delete test with id=${id}`
            });
            } else {
                // remove test result
                Result.deleteMany({'test': id});
                res.send({ message: "Test was deleted successfully." });
            }
        });
};

exports.test_create_post = function(req, res) {
    var test_name = req.body.test_name;
    var test_date = req.body.test_date;
    var subject_id = req.body.subject_id;

    var new_test = new Test(
        {   
            test_name: test_name, 
            test_date: test_date, 
            subject: subject_id 
        }
    );

    // check whether subject already has this test or not
    Test.findOne({ 'test_name': test_name, 'subject': subject_id })
        .exec(function(err, found_test) {
            if(err) {
                res.status(500).send({
                    message:
                    err.message || "Cannot create new test."
                });
                return;
            }
            if(found_test) {
                res.status(400).send({
                    message:
                    err.message || 'Test with name=${test_name} is already existed.'
                });
                return;
            }
            else {
                new_test.save(function(err) {
                    if(err) {
                        res.status(500).send({
                            message:
                            err.message || "Cannot create new test."
                        });
                        return;
                    }
                    res.send({ message: "Test was created successfully." });
                });
            }
        });
};
