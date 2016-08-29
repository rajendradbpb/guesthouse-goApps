var express = require('express');
var path = require('path');
var router = express.Router();
var guestHouseCtrl = require("./../controllers/guestHouseCtrl");
var passport = require("passport");

router.post('/', passport.authenticate('isAdmin', {session:false}) ,function(req, res, next) {
  guestHouseCtrl.addGuestHouse(req, res);
});
router.get('/', passport.authenticate('token', {session:false}),function(req, res, next) {

  guestHouseCtrl.getGuestHouse(req, res);
});
router.put('/', passport.authenticate('ghAuth', {session:false}), function(req, res, next) {
  guestHouseCtrl.udpateGuestHouse(req, res);
});
router.delete('/',passport.authenticate('isAdmin', {session:false}), function(req, res, next) {
  guestHouseCtrl.deleteGuestHouse(req, res);
});

/**
 * crud operation for the rooms under the guest house
 */
router.post('/room', passport.authenticate('ghAuth', {session:false}),function(req, res, next) {
  guestHouseCtrl.addRoom(req, res);
});
router.get('/room', passport.authenticate('token', {session:false}),function(req, res, next) {
  guestHouseCtrl.getRoom(req, res);
});
router.put('/room',passport.authenticate('ghAuth', {session:false}), function(req, res, next) {
  guestHouseCtrl.udpateRoom(req, res);
});
router.delete('/room',passport.authenticate('ghAuth', {session:false}), function(req, res, next) {
  guestHouseCtrl.deleteRoom(req, res);
});




module.exports = router;
