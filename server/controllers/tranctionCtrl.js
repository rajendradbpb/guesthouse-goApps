var colors = require('colors');
var mongoose = require('mongoose');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var password = require('password-hash-and-salt');
var config = require("config");
var tranctionModelObj = require("./../models/tranction");
var roomModelObj = require("./../models/room");

/*
* Tranction crud operation starts
*/
exports.addTranction = function (req, res) {
    // validating gh user against the room
    var query = {
      _id: { $in: req.body.rooms },
      guestHouse:req.user._doc._id
    }
    roomModelObj.find(query).exec()
    .then(function(data) {
      if(data.length > 0){
        console.log("got the rooms");
        req.body.createdBy = req.body.updatedBy = req.user._doc._id;
        return tranctionModelObj(req.body).save();
      }
      else {
        // no room AVAILABLE for the ghuser ... send failure
        return res.json(response(402,"failed",constants.messages.errors.transactionfailed))
      }

    })
    .then(function(transaction) {
      if(transaction)
      {
        // update the selected room status
        var query = {
          "_id": { "$in": req.body.rooms },
          "guestHouse":req.user._doc._id
        };
        var update = {
            "bookingStatus" : "CHECKED-IN"
        };
        var options = {
          "new" : true,
          "multi":true
        };
        roomModelObj.where(query).update(update).exec(function(err,updatedRooms) {
          if(updatedRooms){
            return res.json(response(200,"success",constants.messages.success.saveData,transaction));
          }
          else {
            return res.json(response(402,"failed",constants.messages.errors.transactionfailed));
          }
        });
      }
      else {
        return res.json(response(402,"failed",constants.messages.errors.transactionfailed));
      }
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.saveData,err))
    });
}
exports.getTranction = function (req, res) {
  var query = {
    "isDelete" : false
  };
  if(req.query._id){
    query._id = req.query._id;
  }
  if(req.query.otp){
    query.otp = req.query.otp;
  }
  if(req.query.cName){
    query.cName = req.query.cName;
  }
  if(req.query.cMobile){
    query.cMobile = req.query.cMobile;
  }
  if(req.query.tranctionNo){
    query.tranctionNo = req.query.tranctionNo;
  }
  // validating data as per the user requested
  var select = {};
  // // no condition as admin can access all
  if(req.user._doc.role.type == "ghUser"){
    query.createdBy = req.user._doc._id; // filter added to extract the data specific to the ghuser
  }
  tranctionModelObj.find(query).select(select).exec()
    .then(function(tranction) {
      return res.json(response(200,"success",constants.messages.success.getCustomer,tranction))
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.getCustomer,err))
    })
}
exports.udpateFacility = function (req, res) {
  var id = req.body._id;
  delete req.body['_id']; //  removed to avoid the _id mod error
  req.body.updatedBy = req.user._doc._id;
  req.body.updatedDate = new Date();
  tranctionModelObj.findOneAndUpdate({"_id":id},req.body,{"new":true}).exec(function (err,Facility) {
    if(err)
    {
      return res.json(response(500,"error",constants.messages.errors.updateData,err))
    }
    else if (!Facility) {
      return res.json(response(202,"success",constants.messages.errors.noData))
    }
    else {
      // creating new token with the new user details
      return res.json(response(200,"success",constants.messages.success.updateData))
    }
  });
}
exports.deleteFacility = function (req, res) {
  req.query.updatedBy = req.user._doc._id;
  req.query.updatedDate = new Date();
  console.log(">>>>>>>>>>>>>  ",req.body);
  tranctionModelObj.findByIdAndUpdate(req.body._id,{"isDelete":true},{"new" :true})
  .exec()
  .then(function(data) {
    return res.json(response(200,"success",constants.messages.success.deleteData));
  })
  .catch(function(err) {
    return res.json(response(500,"error",constants.messages.errors.deleteData,err))
  })
}
/*
* tranction crud operation ends
*/
