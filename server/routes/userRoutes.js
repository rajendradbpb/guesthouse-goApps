var express = require('express');
var path = require('path');
var router = express.Router();
var userCtrl = require("./../controllers/userCtrl");
/* GET home page. */
// create the user
router.post('/', function(req, res, next) {
  userCtrl.addUser(req, res);
});
router.get('/', function(req, res, next) {
  userCtrl.getUser(req, res);
});
router.put('/', function(req, res, next) {
  userCtrl.udpateUser(req, res);
});
router.delete('/', function(req, res, next) {
  userCtrl.deleteUser(req, res);
});



module.exports = router;
