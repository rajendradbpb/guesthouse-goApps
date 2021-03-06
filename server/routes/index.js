var express = require('express');
var path = require('path');

var userRoutes = require("./userRoutes");
var adminRoutes = require("./adminRoutes");
var customerRoutes = require("./customerRoutes");
var guestHouseRoutes = require("./guestHouseRoutes");
var facilityRoutes = require("./facilityRoutes");
var transactionRoutes = require("./transactionRoutes");
var reportRoutes = require("./reportRoutes");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

/*
  * adding modular routes starts
*/

/*
  * adding routes for the user
  * all the user related operation will be mapped in this section
*/
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);
router.use('/guestHouse', guestHouseRoutes);
router.use('/facility', facilityRoutes);
router.use('/transaction', transactionRoutes);
router.use('/report', reportRoutes);



/*
  * adding modular routes ends
*/
module.exports = router;
