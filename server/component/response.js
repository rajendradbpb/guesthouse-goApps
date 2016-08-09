/**
 * This file is meant for giving the custom errors
 * params @status | @message | @description
 */

module.exports = function(statusCode,status,message,data) {
  var response = {};

  response.statusCode = statusCode;
  response.status = status;
  response.message = message;
  response.data = data;
  return response;
}
