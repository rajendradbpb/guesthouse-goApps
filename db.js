/*
 * The file will take care of the database connectivity
 */

 var mongoose = require('mongoose');
// database connection setup
module.exports =  mongoose.connect("mongodb://localhost:27017/guestHouse");
