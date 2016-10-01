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
  var filter= {}
  if(req.query.fromDate &&  req.query.toDate){
    req.query.fromDate = new Date(req.query.fromDate);
    req.query.toDate = new Date(req.query.toDate);
    if(validator.isDate(req.query.fromDate) && validator.isDate(req.query.toDate) && req.query.toDate >= req.query.fromDate)
    {
      filter.dateLimit = true;
    }
    else {
      return res.status(402).json(response(402,"failed",constants.messages.errors.inValidDateLimit))
    }
  }
  // custom validation
  // if(req.query.fromDate && !validator.isDate(req.query.fromDate))
  //   return res.status(402).json(response(402,"failed",constants.messages.errors.fromDateRequired))
  // if(req.query.toDate &&  !validator.isDate(req.query.toDate))
  //   return res.status(402).json(response(402,"failed",constants.messages.errors.toDateRequired))
  // // validating start date and end date
  // if(req.query.fromDate &&  req.query.toDate && req.query.fromDate > req.query.toDate)
  //   return res.status(402).json(response(402,"failed",constants.messages.errors.inValidDateLimit))

  var query = {};
  if(filter.dateLimit){
    query["$and"] = [
      {'createdDate':{'$gte':req.query.fromDate}},
      {'createdDate':{'$lt': utility.getDateFormat({operation:"add",mode:"day",count:1,startDate:new Date(req.query.toDate)})}}
    ]
  }
  if(req.user._doc.role.type == "ghUser"){
      query.createdBy = req.user._doc._id;
  }
  // check condition for the deepPopulate
  var deepPopulate = 'transaction';
  if(req.query._id){
    deepPopulate = 'transaction.roomsDetails.room' // if the _id given we need all the details of the history
    query._id = req.query._id;
  }
  tranctionHistoryModelObj.find(query)
  .deepPopulate(deepPopulate)
  .exec()
  .then(function(trans) {
    return res.json(response(200,"success",constants.messages.success.getData,trans));
  })
  .catch(function(err){
    return res.json(response(500,"error","error in history",err));
  })
}
/*
* Facility crud operation ends
*/
