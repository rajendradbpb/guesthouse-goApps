var express = require('express');
var path = require('path');
var router = express.Router();
var userCtrl = require("./../controllers/userCtrl");
/* GET home page. */
// create the user
router.post('/', function(req, res, next) {
  userCtrl.addUser(req, res);
});
router.get('/add', function(req, res, next) {
  res.send('User add to be go here');
});


module.exports = router;
