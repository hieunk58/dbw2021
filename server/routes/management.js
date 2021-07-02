var express = require('express');
var router = express.Router();

// This route will manage all routes fro user, class, subject, test, test result
var class_controller = require("../controllers/classController");
var subject_controller = require("../controllers/subjectController");
var test_controller = require("../controllers/testController");
var result_controller = require("../controllers/resultController");
var user_controller = require("../controllers/userController");
var enrollment_controller = require("../controllers/enrollmentController");


/// USER ROUTES ///
// GET user list
router.get('/users', user_controller.user_list);
// POST create new user
router.post('/user/create', user_controller.user_create_post);
// POST update user
router.post('/user/:id/update', user_controller.user_update_post);
// POST delete user
router.post('/user/:id/delete', user_controller.user_delete_post);
// GET user detail
router.get('/user/:id', user_controller.user_detail);
/// END USER ROUTES ///

/// CLASS ROUTES ///
// GET class list
router.get('/classes', class_controller.class_list);
// POST create new class
router.post('/class/create', class_controller.class_create_post);
// POST update class name
router.post('/class/:id/update', class_controller.class_update_post);
// POST delete class
router.post('/class/:id/delete', class_controller.class_delete_post);
// GET class detail
router.get('/class/:id', class_controller.class_detail);
/// END CLASS ROUTES ///

/// ENROLLMENT ROUTES ///
router.get('/enrollments', enrollment_controller.enrollment_list);
router.get('/enrollment/student', enrollment_controller.student_enrollment_get);
router.post('/enrollment/register',  enrollment_controller.register_student_post);
router.post('/enrollment/deregister', enrollment_controller.deregister_student_post);
router.get('/enrollment/:id', enrollment_controller.class_student_get);
/// ENROLLMENT ROUTES ///

/// SUBJECT ROUTES ///
// GET subject list
router.get('/subjects', subject_controller.subject_list);
// POST create new subject
router.post('/subject/create', subject_controller.subject_create_post);
// POST update subject name
router.post('/subject/:id/update', subject_controller.subject_update_post);
// POST delete subject
router.post('/subject/:id/delete', subject_controller.subject_delete_post);
// GET subject detail
router.get('/subject/:id', subject_controller.subject_detail);
/// END SUBJECT ROUTES ///

/// TEST ROUTES ///
// GET test list
router.get('/tests', test_controller.test_list);
// POST create new test
router.post('/test/create', test_controller.test_create_post);
// POST update test
router.post('/test/:id/update', test_controller.test_update_post);
// POST delete a test
router.post('/test/:id/delete', test_controller.test_delete_post);
// GET detail of a test
router.get('/test/:id', test_controller.test_detail);
/// END TEST ROUTES ///

/// TEST RESULT ROUTES ///
router.get('/results', result_controller.result_list); // result list
router.get('/result/student', result_controller.student_result_list);
// POST create new test
// router.post('/test/create', test_controller.test_create_post);
// POST update test result
router.post('/result/:id/update', result_controller.result_update_post);
// POST delete a test
/// END TEST RESULT ROUTES ///

module.exports = router;