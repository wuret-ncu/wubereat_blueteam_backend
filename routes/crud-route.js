var express = require('express');
var userController = require('../controllers/user');
var menuController = require('../controllers/menu');
var questionController = require('../controllers/question');
var orderController = require('../controllers/order');
var router = express.Router();

// user home route
router.get('/', userController.home);

// user register route
router.get('/register', userController.register);

// user login route
router.get('/login', userController.login);

// user logout route
router.get('/logout', userController.logout);

// menu route
router.get('/menu', menuController.menu);

// order route
router.get('/order', orderController.order);

// question route
router.get('/question', questionController.question);

module.exports = router;