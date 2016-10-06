var express = require('express');
var path = require('path');
var router = express.Router();
var tranctionCtrl = require("./../controllers/tranctionCtrl");
var passport = require("passport");

router.post('/', passport.authenticate('ghAuth', {session:false}) ,function(req, res, next) {
  tranctionCtrl.addTranction(req, res);
});
router.get('/', passport.authenticate('token', {session:false}),function(req, res, next) {
  tranctionCtrl.getTranction(req, res);
});
router.put('/', passport.authenticate('ghAuth', {session:false}), function(req, res, next) {
  tranctionCtrl.updateTransaction(req, res);
});
router.delete('/',passport.authenticate('isAdmin', {session:false}), function(req, res, next) {
  tranctionCtrl.deleteTranction(req, res);
});
module.exports = router;
