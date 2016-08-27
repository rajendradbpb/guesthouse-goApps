var express = require('express');
var path = require('path');
var router = express.Router();
var facilityCtrl = require("./../controllers/facilityCtrl");
var passport = require("passport");

router.post('/', passport.authenticate('isAdmin', {session:false}) ,function(req, res, next) {
  facilityCtrl.addFacility(req, res);
});
router.get('/', passport.authenticate('token', {session:false}),function(req, res, next) {
  facilityCtrl.getFacility(req, res);
});
router.put('/', passport.authenticate('isAdmin', {session:false}), function(req, res, next) {
  facilityCtrl.udpateFacility(req, res);
});
router.delete('/',passport.authenticate('isAdmin', {session:false}), function(req, res, next) {
  facilityCtrl.deleteFacility(req, res);
});




module.exports = router;
