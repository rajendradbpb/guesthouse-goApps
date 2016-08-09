var express = require('express');
var path = require('path');
var router = express.Router();
var adminCtrl = require("./../controllers/adminCtrl");
/*
  CRUD for the roles starts
*/
router.post('/role', function(req, res, next) {
  adminCtrl.addRole(req, res);
});
router.get('/role', function(req, res, next) {
  adminCtrl.getRole(req, res);
});
router.delete('/role', function(req, res, next) {
  adminCtrl.deleteRole(req, res);
});
router.put('/role', function(req, res, next) {
  adminCtrl.udpateRole(req, res);
});
/*
  CRUD for the roles ends
*/
module.exports = router;
