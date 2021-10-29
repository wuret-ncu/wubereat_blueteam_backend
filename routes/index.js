var express = require('express');
var router = express.Router();
const UserProfile = require('../models/UserProfile');

router.post('/register', (req, res, next) => {
  
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
