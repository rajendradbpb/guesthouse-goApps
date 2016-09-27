var colors = require('colors');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var password = require('password-hash-and-salt');
var config = require("config");
var roomModelObj = require("./../models/room");
var mongoose = require("mongoose");
var validator = require("validator");
var tranctionModelObj = require("./../models/tranction");
var utility = require("./../component/utility");
var moment = require("moment");

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
// exports.getRoom = function (req, res) {
//   if(req.query.isDash == "1")
//   {
//     if(req.user._doc.role.type == "ccare")
//       return res.json(response(200,"success",constants.messages.errors.auth))
//
//       roomModelObj.aggregate([
//         {
//           // condition to match the logged in user
//           $match: {
//             guestHouse: mongoose.Types.ObjectId(req.user._doc._id),  //$region is the column name in collection
//             isDelete:false,
//           }
//         },
//         {
//           // condition to group the room details
//           "$group": {
//             "_id": {
//                 "roomType": "$roomType",
//                 "bookingStatus": "$bookingStatus"
//             },
//             "count": { "$sum": 1 }
//         }},
//       ], function (err, result) {
//         if (err) {
//           return res.json(response(500,"error",constants.messages.success.getData,err));
//         } else {
//           return res.json(response(200,"success",constants.messages.success.getData,result));
//         }
//       });
//   }
//   else {
//     var query = {
//       "isDelete" : false,
//     };
//     if(req.query._id){
//       query._id = req.query._id;
//     }
//     if(req.query.status){
//       query.bookingStatus = req.query.status;
//     }
//     // adding price filter
//     if(parseInt(req.query.minPrice) && parseInt(req.query.maxPrice)){
//         query.price = {
//           "$gte":parseInt(req.query.minPrice),
//           "$lte":parseInt(req.query.maxPrice)
//       }
//     }
//     // adding filter for the facility
//     if(req.query.facility && req.query.facility.split(",").length > 0 ){
//         query.facility = {
//           "$in":req.query.facility.split(",")
//       }
//     }
//     // adding filter for the room type
//     if(req.query.roomType && req.query.roomType.split(",").length > 0 ){
//         query.roomType = {
//           "$in":req.query.roomType.split(",")
//       }
//     }
//     // validating data as per the user requested
//     var select = {};
//     // no condition as admin can access all
//     if(req.user._doc.role.type == "ccare"){
//       // select = "name  contactDetails establishDate rating MinPrice MaxPrice address";
//     }
//     else if(req.user._doc.role.type == "ghUser"){
//       query.guestHouse = req.user._doc._id;
//       // select = "name  contactDetails rooms establishDate rating MinPrice MaxPrice address";
//     }
//     roomModelObj.find(query)
//     .deepPopulate("guestHouse")
//     .populate("facility")
//     // .select(select)
//     .exec()
//
//     .then(function(guestHouse) {
//       return res.json(response(200,"success",constants.messages.success.getData,guestHouse));
//     })
//     .catch(function(err) {
//       return res.json(response(500,"error",constants.messages.errors.getData,err))
//     })
//
//   }
// }

/**
 * functionName :exports.getRoom()
 * Info : used to get the rooms as per the user basis
 * here the results can be dash board , list , based on the filters and status
 *Note here the room status can be get from transaction
 * input :isDash,isStatus , filters like price , facility, roomType
 * output :array of rooms
 * createdDate - 23-9-16
 * updated on - 23-9-16 // reason for update
 */
exports.getRoom = function (req, res) {
  if(req.query.isDash == "1")
  {
    if(req.user._doc.role.type != "ghUser")
      return res.json(response(200,"success",constants.messages.errors.auth))

      roomModelObj.aggregate([
        {
          // condition to match the logged in user
          $match: {
            guestHouse: mongoose.Types.ObjectId(req.user._doc._id),  //$region is the column name in collection
            isDelete:false,
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
      ], function (err, result) {
        if (err) {
          return res.json(response(500,"error",constants.messages.success.getData,err));
        } else {
          return res.json(response(200,"success",constants.messages.success.getData,result));
        }
      });
  }
  // if user selects a room to get the details of the room
  else if (req.query._id) {
    var query = {
      "_id":mongoose.Types.ObjectId(req.query._id)
    }
    if(req.user._doc.role.type == "ghUser"){
          query.guestHouse = mongoose.Types.ObjectId(req.user._doc._id);
    }
    roomModelObj.find(query).deepPopulate("facility")
    .exec()
    .then(function(room) {
      return res.json(response(200,"success",constants.messages.success.getData,room));
    })
  }
  else {

    var match = {};
    var aggregrate = [];
    var filters = {};// sets the price filter flag
    if(
      parseInt(req.query.minPrice)
      && parseInt(req.query.maxPrice)
      && parseInt(req.query.minPrice)
      && parseInt(req.query.maxPrice)  > parseInt(req.query.minPrice) ){
      req.query.minPrice = parseInt(req.query.minPrice);
      req.query.maxPrice = parseInt(req.query.maxPrice);
      filters.price = true; // sets the price filter
    }
    // req.query.checkInDate ? req.query.checkInDate = new Date(req.query.checkInDate) : new Date();
    match["$and"] = [
      {'roomsDetails.checkInDate':{'$gte':new Date(req.query.checkInDate)}},
      {'roomsDetails.checkInDate':{'$lt': utility.getDateFormat({operation:"add",mode:"day",count:1,startDate:new Date(req.query.checkInDate)})}}
    ]

    // var query = {
    //   "isDelete" : false,
    // };
    // if(req.query._id){
    //   query._id = req.query._id;
    // }
    // // adding filter for the facility
    // if(req.query.facility && req.query.facility.split(",").length > 0 ){
    //     query.facility = {
    //       "$in":req.query.facility.split(",")
    //   }
    // }
    // // adding filter for the room type
    // if(req.query.roomType && req.query.roomType.split(",").length > 0 ){
    //     query.roomType = {
    //       "$in":req.query.roomType.split(",")
    //   }
    // }
    // validating data as per the user requested
    var select = {};

    // no condition as admin can access all
    if(req.user._doc.role.type == "ccare"){
      // select = "name  contactDetails establishDate rating MinPrice MaxPrice address";
    }
    else if(req.user._doc.role.type == "ghUser"){

      match['roomsDetails.guestHouse'] = mongoose.Types.ObjectId(req.user._doc._id);
      // select = "name  contactDetails rooms establishDate rating MinPrice MaxPrice address";
    }
    aggregrate.push({$match:match});
    console.log("aggregrate   ",utility.stringify(aggregrate));
    tranctionModelObj.aggregate(aggregrate)
    .exec()
    .then(function(trans) {
      // return res.json(response(200,"success",constants.messages.success.getData,trans));
      return tranctionModelObj.populate( trans,{ "path": "roomsDetails.room" });
    })
    .then(function(trans1) {
      var nonAvailbleRoomsId = [];
      var nonAvailableRooms = [];
      for(var i in trans1){
        for(var j in trans1[i].roomsDetails){

          // adding price filter
          if(
            filters.price
            && trans1[i].roomsDetails[j].price >= req.query.minPrice
            && trans1[i].roomsDetails[j].price <= req.query.maxPrice ){
              nonAvailbleRoomsId.push(trans1[i].roomsDetails[j].room._id);
              nonAvailableRooms.push(trans1[i].roomsDetails[j]);

          }
          else if(!filters.price){
            nonAvailbleRoomsId.push(trans1[i].roomsDetails[j].room._id);
            nonAvailableRooms.push(trans1[i].roomsDetails[j]);
          }
        }
      }
      // getting availble rooms
      var query= {
         "_id": { "$nin": nonAvailbleRoomsId }
      }
      // adding price filter
      if(filters.price){
        query.price = {
            "$gte":parseInt(req.query.minPrice),
            "$lte":parseInt(req.query.maxPrice)
        }
      }
      roomModelObj.find(query)
      .lean()
      .exec(function(err,availableRooms) {
        var data = {
          nonAvailebleRooms :nonAvailableRooms,
          availableRooms :availableRooms,
        }
        return res.json(response(200,"success",constants.messages.success.getData,data));
      })
    })
  }
}
/**
 * functionName :updateRoom
 * Info : used to update the room information
 * input : room data with the room id
 * output : success / error
 * createdDate - 19-9-16
 * updated on -  19-9-16 // reason for update
 */
exports.updateRoom = function (req, res) {
  // adding custom validation before update
  if(validator.isNull(req.body._id))
    return res.status(402).json(response(402,"failed",constants.messages.errors.roomIdRequired))
  if(validator.isNull(req.body.roomType) || constants.roomType.indexOf(req.body.roomType) == -1)
    return res.status(402).json(response(402,"failed",constants.messages.errors.invalidRoomType))
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
