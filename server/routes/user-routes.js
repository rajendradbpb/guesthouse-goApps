var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("user 1");
});
router.get('/add', function(req, res, next) {
  console.log("user add");
});


module.exports = router;
