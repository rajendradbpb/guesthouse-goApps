var colors = require('colors');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var password = require('password-hash-and-salt');
var config = require("config");
var roomModelObj = require("./../models/room");
var mongoose = require("mongoose");

/*
* guest house rooms crud operation starts
*/
exports.addRoom = function (req, res) {
    req.body.createdBy = req.body.updatedBy = req.user._doc._id;
    req.body.guestHouse = req.user._doc._id;
    roomModelObj(req.body).save(function (err, user) {
      if(err)
      {
        return res.json(response(500,"error",constants.messages.errors.saveGuestHouse,err))
      }
      else {
        return res.json(response(200,"success",constants.messages.success.saveGuestHouse))
      }
    });
}
exports.getRoom = function (req, res) {
  if(req.query.isDash == "1")
  {
    if(req.user._doc.role.type == "ccare")
      return res.json(response(200,"success",constants.messages.errors.auth))

      roomModelObj.aggregate([
        {
          // condition to match the logged in user
          $match: {
            guestHouse: mongoose.Types.ObjectId(req.user._doc._id),  //$region is the column name in collection
          }
        },
        {
          // condition to group the room details
          "$group": {
            "_id": {
                "roomType": "$roomType",
                "bookingStatus": "$bookingStatus"
            },
            "count": { "$sum": 1 }
        }},
        // {
        //   // condition to group the room details
        //   "$group": {
        //     "_id": {
        //         // "roomType": "$roomType",
        //         "bookingStatus": "$bookingStatus"
        //     },
        //     "count": { "$sum": 1 }
        // }},


      ], function (err, result) {
        if (err) {
          return res.json(response(500,"error",constants.messages.success.getData,err));
        } else {
          return res.json(response(200,"success",constants.messages.success.getData,result));
        }
      });
  }
  else {
    var query = {
      "isDelete" : false,
    };
    if(req.query._id){
      query._id = req.query._id;
    }
    if(req.query.status){
      query.bookingStatus = req.query.status;
    }
    // adding price filter
    if(parseInt(req.query.minPrice) && parseInt(req.query.maxPrice)){
        query.price = {
          "$gte":parseInt(req.query.minPrice),
          "$lte":parseInt(req.query.maxPrice)
      }
    }
    // adding filter for the facility
    if(req.query.facility && req.query.facility.split(",").length > 0 ){
        query.facility = {
          "$in":req.query.facility.split(",")
      }
    }
    // adding filter for the room type
    if(req.query.roomType && req.query.roomType.split(",").length > 0 ){
        query.roomType = {
          "$in":req.query.roomType.split(",")
      }
    }
    // validating data as per the user requested
    var select = {};
    // no condition as admin can access all
    if(req.user._doc.role.type == "ccare"){
      // select = "name  contactDetails establishDate rating MinPrice MaxPrice address";
    }
    else if(req.user._doc.role.type == "ghUser"){

      query.guestHouse = req.user._doc._id;
      // select = "name  contactDetails rooms establishDate rating MinPrice MaxPrice address";
    }
    roomModelObj.find(query)
    .deepPopulate("guestHouse")
    .populate("facility")
    // .select(select)
    .exec()

    .then(function(guestHouse) {
      return res.json(response(200,"success",constants.messages.success.getData,guestHouse));
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.getData,err))
    })

  }
}
exports.udpateRoom = function (req, res) {
  var id = req.body._id;
  delete req.body['_id']; //  removed to avoid the _id mod error
  req.body.updatedBy = req.user._doc._id;
  req.body.updatedDate = new Date();
  roomModelObj.findOneAndUpdate({"_id":id},req.body,{"new":true}).exec(function (err,guestHouse) {
    if(err)
    {
      return res.json(response(500,"error",constants.messages.errors.updateData,err))
    }
    else if (!guestHouse) {
      return res.json(response(202,"success",constants.messages.errors.noData))
    }
    else {
      // creating new token with the new user details
      return res.json(response(200,"success",constants.messages.success.updateData))
    }
  });
}
exports.deleteRoom = function (req, res) {
  req.query.updatedBy = req.user._doc._id;
  req.query.updatedDate = new Date();
  roomModelObj.findByIdAndUpdate(req.query._id,{"isDelete":true},{"new" :true})
  .exec()
  .then(function(err) {
    return res.json(response(200,"success",constants.messages.errors.deleteData));
  })
  .catch(function(data) {
    return res.json(response(500,"error",constants.messages.success.deleteData,err))
  })
}

/*
* guest house crud operation ends
*/
