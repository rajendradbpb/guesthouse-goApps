/**
 * this is used to keep the logs of the server side operations for tracking
 * this uses winston module from https://github.com/winstonjs/winston

 */
var config = require('config');
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: config[config["env"]].logPath })
    ]
  });
  var logTypes = ["info","error","debug"];
  //
  // logger.log('info', 'Hello distributed log files!');
  // logger.info('Hello again distributed logs');

  exports.log = function(type,message,metaData){
    if(logTypes.indexOf(type) == -1)
      type = "debug";
    logger.log(type, message);
  }
