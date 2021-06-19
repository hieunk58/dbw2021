var express = require('express');
var router = express.Router();
var user_controller = require("../controllers/userController");

/// USER ROUTES ///
// GET user list
router.get('/users', user_controller.user_list);
// POST create new user
router.post('/user/create', user_controller.user_create_post);
// POST update user
router.post('/user/:id/update', user_controller.user_update_post);
// POST delete user
router.post('/user/:id/delete', user_controller.user_delete_post);
/// END USER ROUTES ///

module.exports = router;
