var express = require('express');
var path = require('path');
var router = express.Router();
var userCtrl = require("./../controllers/userCtrl");
var passport = require("passport");
// var passportToken = require("./../../passportToken");
/* GET home page. */
// create the user
// router.post('/', function(req, res, next) {
//   userCtrl.addUser(req, res);
// });
router.post('/', passport.authenticate('isAdmin', {session:false}) ,function(req, res, next) {
  userCtrl.addUser(req, res);
});
router.get('/', function(req, res, next) {
  userCtrl.getUser(req, res);
});
router.put('/', passport.authenticate('token', {session:false}), function(req, res, next) {
  userCtrl.udpateUser(req, res);
});
router.delete('/', function(req, res, next) {
  userCtrl.deleteUser(req, res);
});
router.post('/changePassword', passport.authenticate('token', {session:false}) ,function(req, res, next) {
  userCtrl.changePassword(req, res);
});
// used to get the settings information
router.get('/settings', passport.authenticate('token', {session:false}) ,function(req, res, next) {
  console.log(">>>>>>>>>>>>>>");
  userCtrl.getSettings(req, res);
});
// used to send the verification mail for the password
router.put('/forgetPassword', function(req, res, next) {
  userCtrl.forgetPassword(req, res);
});
// used to reset password after verification mail confirmed
router.put('/resetPassword', function(req, res, next) {
  userCtrl.resetPassword(req, res);
});
router.post('/signIn', passport.authenticate('local', {session:false}) ,userCtrl.signIn);
router.get('/token', passport.authenticate('token', {session:false}) ,function(req,res) {
  // console.log(">>>>>>>>   verify err" , err);
  console.log(">>>>>>>>   verify user" , req.user._doc);
});
router.get('/loggedin',passport.authenticate('token', {session:false}), function(req,res) {
  res.status(200).json({status:"OK",user:req.user._doc});
});
module.exports = router;
