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
var underscore = require('underscore');
var nodeUnique = require('node-unique-array');
var unique = require('make-unique');
var sendResponse = require('./../component/sendResponse');
var autowire = require('./../../config/autowire');

/*
* guest house rooms crud operation starts
*/
exports.addRoom = function (req, res) {
    req.body.createdBy = req.body.updatedBy = req.user._doc._id;
    req.body.guestHouse = req.user._doc._id;
    req.body = validateOffer(req.body);
    roomModelObj.preSave(req,function(err,response) {
      if(err){
        console.log(err.message);
        sendResponse(res,500,"error",err.message,err)
      }
      else{
        roomModelObj(req.body).save(function (err, room) {
          if(err)
          {
            sendResponse(res,500,"error",constants.messages.errors.saveGuestHouse,err)
          }
          else {
            sendResponse(res,200,"success",constants.messages.success.saveGuestHouse)
          }
        });
      }
    })
}
/**
 * functionName :validateOffer()
 * Info : Used to validate the offer with the existing price , if not valid offer
          will not consider to save offer details in the database
 * input : reqBody
 * output :reqBody
 * createdDate - 30-9-2016
 * updated on -  30-9-2016 // reason for update
 */
function validateOffer(reqBody){
  if(!reqBody.isOffer || !reqBody.offerPrice || !(reqBody.offerPrice < reqBody.price)){
    delete reqBody['isOffer'];
    delete reqBody['offerPrice'];
  }
  return reqBody;
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
  if(req.query.minPrice)
    req.query.minPrice = parseInt(req.query.minPrice);
  if(req.query.maxPrice)
    req.query.maxPrice = parseInt(req.query.maxPrice);

  // if(req.query.isDash == "1")
  // {
  //   if(req.user._doc.role.type != "ghUser")
  //     return res.json(response(200,"success",constants.messages.errors.auth))
  //
  //     roomModelObj.aggregate([
  //       {
  //         // condition to match the logged in user
  //         $match: {
  //           guestHouse: mongoose.Types.ObjectId(req.user._doc._id),  //$region is the column name in collection
  //           isDelete:false,
  //         }
  //       },
  //       {
  //         // condition to group the room details
  //         "$group": {
  //           "_id": {
  //               "roomType": "$roomType",
  //               "bookingStatus": "$bookingStatus"
  //           },
  //           "count": { "$sum": 1 }
  //       }},
  //     ], function (err, result) {
  //       if (err) {
  //         return res.json(response(500,"error",constants.messages.success.getData,err));
  //       } else {
  //         return res.json(response(200,"success",constants.messages.success.getData,result));
  //       }
  //     });
  // }
  // if user selects a room to get the details of the room
  if (req.query._id) {

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
    var roomCount = {
      availableRooms : 0,
      bookedRooms : 0,
      checkedInRooms : 0,
    };
    // adding condition for the price
    if((req.query.minPrice == "" || req.query.minPrice == undefined) && utility.isDataExist(req.query.maxPrice,true) ){
      // if min price not mentioed and max price mentioed then make minPrice as ZERO
      req.query.minPrice = 0 ;
    }
    if((req.query.maxPrice == "" || req.query.maxPrice == undefined) && utility.isDataExist(req.query.minPrice,true) ){
      return res.json(response(202,"failed",constants.messages.errors.invalidPriceQuery));
    }
    if(parseInt(req.query.minPrice) > parseInt(req.query.maxPrice)){
      sendResponse(res,202,"failed",constants.messages.errors.invalidPriceQuery);
    }
    if(
      utility.isDataExist(req.query.minPrice)
      && utility.isDataExist(req.query.maxPrice)
      && req.query.maxPrice  >= req.query.minPrice ){
      filters.price = true; // sets the price filter
    }
    if(req.query.roomType){
      filters.roomType = true;
    }
    if(req.query.facilities){
      filters.facilities = true;
      req.query.facilities = req.query.facilities.split(",");
    }
    // req.query.checkInDate ? req.query.checkInDate = new Date(req.query.checkInDate) : new Date();
    match["$and"] = [
      {'roomsDetails.checkInDate':{'$lte':new Date(req.query.checkInDate)}},
      // {'roomsDetails.checkInDate':{'$lt': utility.getDateFormat({operation:"add",mode:"day",count:1,startDate:new Date(req.query.checkInDate)})}}
      {'roomsDetails.checkOutDate':{'$gte': new Date(req.query.checkInDate)}}
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
      console.log("mongoose.Types.ObjectId(req.user._doc._id)  ",mongoose.Types.ObjectId(req.user._doc._id));
      match['guestHouse'] = mongoose.Types.ObjectId(req.user._doc._id);
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
      for(var i = 0 ; i < trans1.length ; i++){
        for(var j = 0 ; j < trans1[i].roomsDetails.length ; j++ ){
          // checking for the dashBoard info
          if(req.query.isDash == "1" && !req.query.status){
            switch (trans1[i].roomsDetails[j].bookingStatus) {
              // case "AVAILABLE":
              //   roomCount.availableRooms ++;
              //   break;
              case "CHECKED-IN":
                roomCount.checkedInRooms ++;
                break;
              case "BOOKED":
                roomCount.bookedRooms ++;
                break;
              default:

            }
            nonAvailbleRoomsId.push(trans1[i].roomsDetails[j].room._id);
            continue;
          }
          else if(req.query.isDash == "1" && req.query.status != "AVAILABLE"){ // skipping availableRooms
            // req.query.status can be availableRooms,bookedRooms,checkedInRooms only
            if(trans1[i].roomsDetails[j].bookingStatus == req.query.status){
              nonAvailableRooms.push(trans1[i].roomsDetails[j]);
              nonAvailbleRoomsId.push(trans1[i].roomsDetails[j].room._id);
            }
            continue;
          }
          if(trans1[i].roomsDetails[j]  && trans1[i].roomsDetails[j].bookingStatus == "AVAILABLE" )
          continue;
          // adding price filter
          if(
            filters.price
            && trans1[i].roomsDetails[j].price >= req.query.minPrice
            && trans1[i].roomsDetails[j].price <= req.query.maxPrice ){
              nonAvailbleRoomsId.push(trans1[i].roomsDetails[j].room._id);
              nonAvailableRooms.push(trans1[i].roomsDetails[j]);

          }
          if(filters.roomType && trans1[i].roomsDetails[j].room.roomType == req.query.roomType){
            nonAvailbleRoomsId.push(trans1[i].roomsDetails[j].room._id);
            nonAvailableRooms.push(trans1[i].roomsDetails[j]);
          }
          if(filters.facilities && underscore.intersection(req.query.facilities, trans1[i].roomsDetails[j].room.facility.toString().split(",")).length){
            nonAvailbleRoomsId.push(trans1[i].roomsDetails[j].room._id);
            nonAvailableRooms.push(trans1[i].roomsDetails[j]);

          }
          if(!filters.price && !filters.facilities  && !filters.roomType){
            nonAvailbleRoomsId.push(trans1[i].roomsDetails[j].room._id);
            nonAvailableRooms.push(trans1[i].roomsDetails[j]);
          }
        }
      }
      nonAvailbleRoomsId = unique(nonAvailbleRoomsId);
      nonAvailableRooms = unique(nonAvailableRooms);
      // getting availble rooms
      var query= {
         "_id": { "$nin": nonAvailbleRoomsId },
         "isDelete":false,
      }
      if(req.user._doc.role.type == "ghUser"){
        query['guestHouse'] = req.user._doc._id;
      }
      // adding price filter
      if(filters.price){
        query.price = {
            "$gte":parseInt(req.query.minPrice),
            "$lte":parseInt(req.query.maxPrice)
        }
      }
      // adding facilities filter
      if(filters.facilities){
        query.facility = {
            "$in":req.query.facilities
        }
      }
      // adding room type
      if(filters.roomType){
        query.roomType = req.query.roomType;
      }
      // checking for the dashBoard service or not
      if(req.query.isDash == "1" && !req.query.status){
        roomModelObj.count(query,function(err,count) {
          if(err)
            sendResponse(res,500,"error",constants.messages.errors.getData,err);
          else{
            roomCount.availableRooms = count;
            sendResponse(res,200,"success",constants.messages.success.getData,roomCount);
          }
        })
        // return res.json(response(200,"success",constants.messages.success.getData,data));
      }
      else if(req.query.isDash == "1" && req.query.status && req.query.status != "AVAILABLE"){
        var data = {
          nonAvailebleRooms :nonAvailableRooms,
          availableRooms :[],
        }
        sendResponse(res,200,"success",constants.messages.success.getData,data);
        // return res.json(response(200,"success",constants.messages.success.getData,data));
      }
      else if(req.query.isDash == "1" && req.query.status && req.query.status == "AVAILABLE"){
        roomModelObj.find(query,function(err,rooms) {
          if(err)
            sendResponse(res,500,"error",constants.messages.errors.getData,err);
          else{
            var data = {
              nonAvailebleRooms :[],
              availableRooms :rooms,
            }
            sendResponse(res,200,"success",constants.messages.success.getData,data);
          }
        })
        // return res.json(response(200,"success",constants.messages.success.getData,data));
      }
      else {
        roomModelObj.find(query)
        .lean()
        .exec(function(err,availableRooms) {
          var data = {
            nonAvailebleRooms :nonAvailableRooms,
            availableRooms :availableRooms,
          }
          return res.json(response(200,"success",constants.messages.success.getData,data));
        })
      }
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
                30-9-16 // to Update the offer price details
 */
exports.updateRoom = function (req, res) {
  // adding custom validation before update
  if(validator.isNull(req.body._id))
    return res.status(402).json(response(402,"failed",constants.messages.errors.roomIdRequired))
  // if(validator.isNull(req.body.roomType) || constants.roomType.indexOf(req.body.roomType) == -1)
  //   return res.status(402).json(response(402,"failed",constants.messages.errors.invalidRoomType))
  var id = req.body._id;
  delete req.body['_id']; //  removed to avoid the _id mod error
  req.body.updatedBy = req.user._doc._id;
  req.body.updatedDate = new Date();
  req.body = validateOffer(req.body);
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
  // checking for the rooms AVAILABLE status , only then room will be allowed to delete
  var match = {
    "roomsDetails.room" : mongoose.Types.ObjectId(req.query._id)
  }
  tranctionModelObj.aggregate([{$match:match}])
  .exec()
  .then(function(nonAvailebleRooms) {
    console.log("nonAvailebleRooms   ",nonAvailebleRooms);
    if(nonAvailebleRooms.length){
      return res.json(response(202,"failed",constants.messages.errors.roomDeleteNotAvaiable));
    }
    else {
      console.log("room tobe deleted",req.query._id, typeof req.query._id);
      roomModelObj.findByIdAndUpdate(req.query._id,{"isDelete":true},{"new" :true},function(err,roomData) {
        if(err)
          return res.json(response(500,"error",constants.messages.errors.deleteData,err))
        else {

          return res.json(response(200,"success",constants.messages.success.deleteData));
        }
      })

      // .then(function(response) {
      //   return res.json(response(200,"success",constants.messages.success.deleteData));
      // })
      // .catch(function(err) {
      //   return res.json(response(500,"error",constants.messages.errors.deleteData,err))
      // })
    }
  })

}

/*
* guest house crud operation ends
*/
