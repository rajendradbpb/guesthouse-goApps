var express = require('express');
var path = require('path');
var router = express.Router();
var userCtrl = require("./../controllers/userCtrl");
var customerCtrl = require("./../controllers/customerCtrl");
var passport = require("passport");

router.post('/', passport.authenticate('addCustomer', {session:false}) ,function(req, res, next) {
  customerCtrl.addCustomer(req, res);
});
router.get('/', passport.authenticate('addCustomer', {session:false}),function(req, res, next) {
  customerCtrl.getCustomer(req, res);
});
router.put('/', passport.authenticate('addCustomer', {session:false}), function(req, res, next) {
  customerCtrl.udpateCustomer(req, res);
});
router.delete('/',passport.authenticate('addCustomer', {session:false}), function(req, res, next) {
  customerCtrl.deleteCustomer(req, res);
});




module.exports = router;
