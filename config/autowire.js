/**
 * this is used to Requried list of files mentioned
 * these files are the confugration files that are used by many other files like for events, logger etc
 * createdDate - 22-10-2016
 * updated on -  22-10-2016
 */
var fs = require('fs');
 var fileList = [
   "./events.js",
   "./logger.js",
   "./constants.js"
 ]
 var autoWire = {};
 // loading filespath
 for(var i in fileList){
    var filePath = fileList[i];
     var file = fileList[i].split("/"); // get file name from last index
     file = file[file.length-1].split(".")[0]; // get the file name without extension to create indentifier
    autoWire[file] = require(filePath);
 }
 // export autoWire
 exports.wire = function(file) {
   return autoWire[file];
 };
