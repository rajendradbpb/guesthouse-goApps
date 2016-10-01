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
// exports.addReport = function (req, res) {
//     req.body.createdBy = req.body.updatedBy = req.user._doc._id;
//     facilityModelObj(req.body).save(function (err, user) {
//       if(err)
//       {
//         return res.json(response(500,"error",constants.messages.errors.saveData,err))
//       }
//       else {
//         return res.json(response(200,"success",constants.messages.success.saveData))
//       }
//     });
// }
// exports.getReport = function (req, res) {
//   // converting to date object in server end
//   req.query.fromDate = new Date(req.query.fromDate);
//   req.query.toDate = new Date(req.query.toDate);
//   // custom validation
//   if(validator.isNull(req.query.fromDate) || !validator.isDate(req.query.fromDate))
//     return res.status(402).json(response(402,"failed",constants.messages.errors.fromDateRequired))
//   if(validator.isNull(req.query.toDate) || !validator.isDate(req.query.toDate))
//     return res.status(402).json(response(402,"failed",constants.messages.errors.toDateRequired))
//   // validating start date and end date
//   if(req.query.fromDate > req.query.toDate)
//     return res.status(402).json(response(402,"failed",constants.messages.errors.inValidDateLimit))
//       console.log("11111111");
//   if(!utility.dateDiff(req.query.fromDate,req.query.toDate))
//   {
//
//     req.query.toDate = utility.getDateFormat( {operation:"add",mode:"day",count:1,startDate:new Date(req.query.fromDate)})
//
//   }
//   console.log("2222222");
//   var query = {};
//
//   // adding start date and the end date filter .. based on the createdDate
//
//
//   if(req.query.fromDate && req.query.toDate)
//   {
//     query["createdDate"] = {
//         "$gte" : req.query.fromDate,
//         "$lte" : req.query.toDate,
//       }
//   }
//   console.log("3333333333",req.user._doc);
//   // if(req.user._doc.role.type == "ghUser"){
//   //   query['transaction.guestHouse'] = req.user._doc._id;
//   // }
//   // validating data as per the user requested
//   // var select = {};
//   // // no condition as admin can access all
//   // if(req.user._doc.role.type == "ccare"){
//   //   select = "name  contactDetails establishDate rating MinPrice MaxPrice address";
//   // }
//   // else if(req.user._doc.role.type == "ghUser"){
//   //   select = "name  contactDetails rooms establishDate rating MinPrice MaxPrice address";
//   // }
//   console.log('query   ',query);
//   tranctionHistoryModelObj.find(query)
//   // .deepPopulate('transaction')
//   .exec(function(err,transaction) {
//     if(err)
//       return res.json(response(500,"err","errrrr",err))
//       else {
//
//         return res.json(response(200,"success",constants.messages.success.getCustomer,transaction))
//       }
//     })
//     // .then(function(transaction) {
//     //   return res.json(response(200,"success",constants.messages.success.getCustomer,transaction))
//     // })
//     // .catch(function(err) {
//     //   return res.json(response(500,"error",constants.messages.errors.getCustomer,err))
//     // })
// }
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
exports.udpateReport = function (req, res) {
  // var id = req.body._id;
  // delete req.body['_id']; //  removed to avoid the _id mod error
  // req.body.updatedBy = req.user._doc._id;
  // req.body.updatedDate = new Date();
  // facilityModelObj.findOneAndUpdate({"_id":id},req.body,{"new":true}).exec(function (err,Facility) {
  //   if(err)
  //   {
  //     return res.json(response(500,"error",constants.messages.errors.updateData,err))
  //   }
  //   else if (!Facility) {
  //     return res.json(response(202,"success",constants.messages.errors.noData))
  //   }
  //   else {
  //     // creating new token with the new user details
  //     return res.json(response(200,"success",constants.messages.success.updateData))
  //   }
  // });
}
exports.deleteReport = function (req, res) {
  // req.query.updatedBy = req.user._doc._id;
  // req.query.updatedDate = new Date();
  // console.log(">>>>>>>>>>>>>  ",req.body);
  // facilityModelObj.findByIdAndUpdate(req.body._id,{"isDelete":true},{"new" :true})
  // .exec()
  // .then(function(data) {
  //   return res.json(response(200,"success",constants.messages.success.deleteData));
  // })
  // .catch(function(err) {
  //   return res.json(response(500,"error",constants.messages.errors.deleteData,err))
  // })
}
/*
* Facility crud operation ends
*/
