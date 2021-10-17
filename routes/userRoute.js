const express = require("express");
const userController = require('../controller/userController');
const auth = require('../controller/authController');




const user = express.Router();

user.route('/signUp').post(userController.signUp);
user.route('/login').post(userController.login);
user.route('/logout').get(userController.logout);
user.route('/updateMe').patch(auth.protect, userController.uploadPp, userController.updateMe);
user.route('/me').get(auth.isLoggedIn, userController.getMe);


module.exports = user;