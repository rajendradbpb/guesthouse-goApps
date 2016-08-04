var express = require('express');
var path = require('path');
var userRoutes = require('./user-routes');
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



/*
  * adding modular routes ends
*/
module.exports = router;
