var express = require('express');
var path = require('path');
var router = express.Router();
var reportCtrl = require("./../controllers/reportCtrl");
var passport = require("passport");

router.post('/', passport.authenticate('ghAuth', {session:false}) ,function(req, res, next) {
  reportCtrl.addReport(req, res);
});
router.get('/', passport.authenticate('token', {session:false}),function(req, res, next) {
  reportCtrl.getReport(req, res);
});
router.put('/', passport.authenticate('ghAuth', {session:false}), function(req, res, next) {
  reportCtrl.udpateReport(req, res);
});
router.delete('/',passport.authenticate('ghAuth', {session:false}), function(req, res, next) {
  reportCtrl.deleteReport(req, res);
});
module.exports = router;
