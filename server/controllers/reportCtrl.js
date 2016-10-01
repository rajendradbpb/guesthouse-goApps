var colors = require('colors');
var response = require("./../component/response");
var utility = require("./../component/utility");
var constants = require("./../../config/constants");
var password = require('password-hash-and-salt');
var config = require("config");
var tranctionModelObj = require("./../models/tranction");
var tranctionHistoryModelObj = require("./../models/tranctionHistory");
var validator = require("validator");

/*
* Facility crud operation starts
*/

exports.getReport = function (req, res) {
  // converting to date object in server end
  req.query.fromDate = new Date(req.query.fromDate);
  req.query.toDate = new Date(req.query.toDate);
  // custom validation
  if(validator.isNull(req.query.fromDate) || !validator.isDate(req.query.fromDate))
    return res.status(402).json(response(402,"failed",constants.messages.errors.fromDateRequired))
  if(validator.isNull(req.query.toDate) || !validator.isDate(req.query.toDate))
    return res.status(402).json(response(402,"failed",constants.messages.errors.toDateRequired))
  // validating start date and end date
  if(req.query.fromDate > req.query.toDate)
    return res.status(402).json(response(402,"failed",constants.messages.errors.inValidDateLimit))
  var match = {};
  var aggregrate = [];
  match["$and"] = [
    {'createdDate':{'$gte':req.query.fromDate}},
    {'createdDate':{'$lt': req.query.toDate}}
  ]
  aggregrate.push({$match:match});
  console.log("aggregrate   ",utility.stringify(aggregrate));
  tranctionHistoryModelObj.aggregate(aggregrate)
  .exec()
  .then(function(trans) {
    // return res.json(response(200,"success",constants.messages.success.getData,trans));
    return tranctionHistoryModelObj.populate(trans,{ "path": "rooms" });
  })
  .then(function(trans) {
    return res.json(response(200,"success",constants.messages.success.getData,trans));
  })
  .catch(function(err) {
    return res.json(response(500,"error","error in reports",err));
  })
}
/*
* Facility crud operation ends
*/
