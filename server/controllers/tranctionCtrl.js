var colors = require('colors');
var mongoose = require('mongoose');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var password = require('password-hash-and-salt');
var config = require("config");
var tranctionModelObj = require("./../models/tranction");
var tranctionHistoryModelObj = require("./../models/tranctionHistory");
var roomModelObj = require("./../models/room");
var DateOnly = require('mongoose-dateonly')(mongoose);
var utility = require('./../component/utility');
/*
* Tranction crud operation starts
*/
// exports.addTranction_bk = function (req, res) {
//     // validating gh user against the room
//     var query = {
//       _id: { $in: req.body.rooms },
//       guestHouse:req.user._doc._id
//     }
//     roomModelObj.find(query).exec()
//     .then(function(data) {
//       if(data.length > 0){
//         console.log("got the rooms");
//         req.body.createdBy = req.body.updatedBy = req.user._doc._id;
//         req.body.tranctionNo = req.body.tranctionNo;
//         return tranctionModelObj(req.body).save();
//       }
//       else {
//         // no room AVAILABLE for the ghuser ... send failure
//         return res.json(response(402,"failed",constants.messages.errors.transactionfailed))
//       }
//
//     })
//     .then(function(transaction) {
//       if(transaction)
//       {
//         // update the selected room status
//         var query = {
//           "_id": { "$in": req.body.rooms },
//           "guestHouse":req.user._doc._id
//         };
//         var update = {
//             "bookingStatus" : "CHECKED-IN"
//         };
//         var options = {
//           "new" : true,
//           "multi":true
//         };
//         roomModelObj.update(query,update,options).exec(function(err,updatedRooms) {
//           if(updatedRooms){
//             return res.json(response(200,"success",constants.messages.success.saveData,transaction));
//           }
//           else {
//             return res.json(response(402,"failed",constants.messages.errors.transactionfailed));
//           }
//         } );
//       }
//       else {
//         return res.json(response(402,"failed",constants.messages.errors.transactionfailed));
//       }
//     })
//     .catch(function(err) {
//       return res.json(response(500,"error",constants.messages.errors.saveData,err))
//     });
// }

exports.addTranction = function (req, res) {
    // validating gh user against the room
    var query = {
      _id: { $in: req.body.rooms },
      guestHouse:req.user._doc._id
    }
    // console.log("query    ",query);
    roomModelObj.find(query).exec()
    .then(function(rooms) {
      if(rooms.length > 0){
        req.body.createdBy = req.body.updatedBy = req.user._doc._id;
        req.body.createdDate = new Date();
        req.body.tranctionNo = req.body.tranctionNo;
        // creating rooms details array
        req.body.roomsDetails = [];
        for(var i in rooms){
          req.body.roomsDetails[i] = {};
          req.body.roomsDetails[i]['room'] = rooms[i]._id;
          req.body.roomsDetails[i]['bookingStatus'] = req.body.bookingStatus; // keeping booking status same at create transaction
          req.body.roomsDetails[i]['guestHouse'] = req.body.guestHouse; // adding guest house id
          if(req.body.checkInDate)
          {
            req.body.checkInDate = new Date(req.body.checkInDate);
            req.body.roomsDetails[i]['checkInDate'] = req.body.checkInDate;
          }
          if(req.body.checkOutDate)
          {
            req.body.checkOutDate = new Date(req.body.checkOutDate);
            req.body.roomsDetails[i]['checkOutDate'] = req.body.checkOutDate;
          }
          if(rooms[i].isOffer &&  rooms[i].offerPrice <  rooms[i].price) {
            req.body.roomsDetails[i]['isOffer'] = rooms[i].isOffer;
            req.body.roomsDetails[i]['price'] = rooms[i].offerPrice;
          }
          else {
            req.body.roomsDetails[i]['price'] = rooms[i].price;
          }

        }
        return tranctionModelObj(req.body).save();
      }
      else {
        // no room AVAILABLE for the ghuser ... send failure
        return res.json(response(402,"failed",constants.messages.errors.transactionfailed))
      }

    })
    .then(function(transaction) {
      return res.json(response(200,"success",constants.messages.success.saveData,transaction));
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.saveData,err))
    });
}
// exports.getTranction = function (req, res) {
//   var query = {
//       "$and": [
//           { "$or": [
//               // {_id : new RegExp(req.query.searchStr, 'i')},
//               {otp : new RegExp(req.query.searchStr, 'i')},
//               {cName : new RegExp(req.query.searchStr, 'i')},
//               {cMobile : new RegExp(req.query.searchStr, 'i')},
//               {tranctionNo : new RegExp(req.query.searchStr, 'i')},
//             ]
//           },
//           {"isDelete" : false}
//       ]
//   }
//   // adding price filter
//   if(parseInt(req.query.minPrice) && parseInt(req.query.maxPrice)){
//       query.price = {
//         "$gte":parseInt(req.query.minPrice),
//         "$lte":parseInt(req.query.maxPrice)
//     }
//   }
//   var select = {};
//   // // no condition as admin can access all
//   if(req.user._doc.role.type == "ghUser"){
//     query["$and"].push({"createdBy" : req.user._doc._id}); // filter added to extract the data specific to the ghuser
//   }
//   tranctionModelObj.find(query).deepPopulate("createdBy rooms").exec()
//     .then(function(tranction) {
//       return res.json(response(200,"success",constants.messages.success.getCustomer,tranction))
//     })
//     .catch(function(err) {
//       return res.json(response(500,"error",constants.messages.errors.getCustomer,err))
//     })
// }

exports.getTranction = function (req, res) {
  var query = {};
  var aggregrate = [];
  var match = {};
  match['isDelete'] = false; // fetch only non deleted transaction
  // adding match condition for min max price
  if(parseInt(req.query.minPrice) && parseInt(req.query.maxPrice)){
      match["$and"] = [
        {'roomsDetails.price':{"$gte":parseInt(req.query.minPrice)}},
        {'roomsDetails.price':{"$lte":parseInt(req.query.maxPrice)}}
      ]
  }
  // adding match if user is ghUser so that only related transaction will get
  if(req.user._doc.role.type == "ghUser"){
    match['createdBy'] = mongoose.Types.ObjectId(req.user._doc._id); // filter added to extract the data specific to the ghuser
  }
  if(req.query.searchStr){
    match['$or'] = [
      {otp : new RegExp(req.query.searchStr, 'i')},
      {cName : new RegExp(req.query.searchStr, 'i')},
      {cMobile : new RegExp(req.query.searchStr, 'i')},
      {tranctionNo : new RegExp(req.query.searchStr, 'i')},
    ]
  }
  aggregrate.push({$match:match});
  // console.log("transaction  aggregrate",aggregrate);
  tranctionModelObj.aggregate(aggregrate).exec()
      .then(function(tranction) {
        // populate room after the aggregration
        tranctionModelObj.populate(tranction, {path: "roomsDetails.room"},function(err,transactionRes) {
          if(err)
            return res.json(response(500,"error",constants.messages.errors.getCustomer,err));
            else {
              return res.json(response(200,"success",constants.messages.success.getCustomer,transactionRes))
            }
        });
        // return res.json(response(200,"success",constants.messages.success.getCustomer,tranction))
      })
      .catch(function(err) {
        return res.json(response(500,"error",constants.messages.errors.getCustomer,err))
      })

}

// exports.udpateTranction = function (req, res) {
//   var id = req.body._id;
//   delete req.body['_id']; //  removed to avoid the _id mod error
//   req.body.updatedBy = req.user._doc._id;
//   req.body.checkOutDate = req.body.checkOutDate || new Date();
//   // req.body.isPayment = true;
//
//   if(req.body.type == "checkOut"){
//       tranctionModelObj.findOneAndUpdate({"_id":id},req.body,{"new":true}).exec(function (err,transaction) {
//       if(err)
//       {
//         return res.json(response(500,"error",constants.messages.errors.updateData,err))
//       }
//       else if (!transaction) {
//         return res.json(response(202,"success",constants.messages.errors.noData))
//       }
//       else {
//         // update the room status to AVAILABLE
//         console.log("transaction updated");
//
//         var query = {
//           "_id": { "$in": req.body.rooms },
//         };
//         var update = {
//             "bookingStatus" : "AVAILABLE"
//         };
//         var options = {
//           "new" : true,
//           "multi":true
//         };
//         roomModelObj.update(query,update,options).exec(function(err,updatedRooms) {
//           if(err)
//           {
//             return res.json(response(500,"error",constants.messages.errors.updateData,err))
//           }
//           else if (!updatedRooms) {
//             return res.json(response(202,"success",constants.messages.errors.noData))
//           }
//           else {
//             // creating new token with the new user details
//             return res.json(response(200,"success",constants.messages.success.updateData))
//           }
//         })
//       }
//     });
//   }
//   else {
//     return res.json(response(402,"failed",constants.messages.errors.noOperation))
//   }
// }
exports.updateTransaction = function (req, res) {
  var id = req.body._id;
  delete req.body['_id']; //  removed to avoid the _id mod error
  req.body.updatedBy = req.user._doc._id;
  req.body.checkOutDate = req.body.checkOutDate || new Date();
  // req.body.isPayment = true;

  if(req.body.type == "checkOut"){
    console.log(req.body.checkOutDate);
      tranctionModelObj.findById(id)
      .exec()
      .then(function(transaction) {
        console.log(">>>>>>>>>>>>>>>    utility.stringify",utility.stringify(transaction.roomsDetails));
        console.log(">>>>>>>>>>>>>>>   req.body.rooms ",req.body.rooms);
        // console.log(">>>>>>>>>>>>>>>   2222222222 ",req.body.rooms.indexOf(String(transaction.roomsDetails[i].room)));
        var statusObj = validateCheckOut(transaction.roomsDetails,req.body);
        if(!statusObj.status){
          return res.json(response(402,"failed","check out failed",statusObj.reason))
        }
        // update the room status to AVAILABLE
        for(var i=0 ; i < transaction.roomsDetails.length && req.body.rooms.indexOf(String(transaction.roomsDetails[i].room)) != -1 && transaction.roomsDetails[i].bookingStatus == "CHECKED-IN" ; i++){
          transaction.roomsDetails[i].bookingStatus = "AVAILABLE";
          transaction.roomsDetails[i].checkDate = new Date(); // setting check out date as same day
        }
        return transaction.save();
      })
      .then(function(transaction) {
        // saving the information into history object
        var obj = {
          transaction    :  transaction,
          // rooms    :  req.body.rooms,
          price    :  req.body.price,
          discount    :  req.body.discount,
          createdBy   : req.user._doc._id,
          updatedBy   : req.user._doc._id,
          transactionType: "CHECK-OUT"
        }
        return tranctionHistoryModelObj(obj).save()

      })
      .then(function(history){
        return res.json(response(200,"success","check out success "))
      })
      .catch(function(err) {
        return res.json(response(500,"error","error in check out  ",err))
      })
  }
  else if(req.body.type == "cancelBooking"){
      tranctionModelObj.findById(id)
      .exec()
      .then(function(transaction) {
        // update the room status to AVAILABLE
        for(var i=0 ; i < transaction.roomsDetails.length && req.body.rooms.indexOf(String(transaction.roomsDetails[i].room)) != -1 && transaction.roomsDetails[i].bookingStatus == "BOOKED" ; i++){
          transaction.roomsDetails[i].bookingStatus = "AVAILABLE";
          transaction.roomsDetails[i].checkDate = new Date(); // setting check out date as same day
        }
        return transaction.save();
      })
      .then(function(transaction) {
        // saving the information into history object
        var obj = {
          transaction    :  transaction,
          transactionType: "BOOKING-CANCEL",
          // rooms    :  req.body.rooms,
          price    :  req.body.price,
          discount    :  req.body.discount,
          createdBy   : req.user._doc._id,
          updatedBy   : req.user._doc._id
        }
        return tranctionHistoryModelObj(obj).save()

      })
      .then(function(history){
        return res.json(response(200,"success","booking cancel success "))
      })
      .catch(function(err) {
        return res.json(response(500,"error","error in booking cancel  ",err))
      })
  }
  else if (req.body.type == "checkedIn") {
    var query = {
      _id:id,
      "roomsDetails":{"$elemMatch":{"bookingStatus":"BOOKED"} } ,
    }
    var update = {
      "$set":{"roomsDetails.$.bookingStatus":"CHECKED-IN"}
    }
    var option = {
      "new":true,
      "upsert": true
    }
    // return tranctionModelObj.find({_id:id}).exec()
    return tranctionModelObj.findOneAndUpdate(query,update,option).exec()
    .then(function(transaction) {
      return res.json(response(200,"success",constants.messages.success.checkedIn))
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.checkedIn,err))
    })
  }
  else {
    return res.json(response(402,"failed","booking cancel failed  "))
  }
}

/**
 * functionName :validateCheckOut(rooms)
 * Info : This is used to validate rooms and test price validation during the check out of the rooms
 * input : roomdetailsArr,inputData
 * output :true | false
 * createdDate - 30-9-2016
 * updated on -  30-9-2016 // reason for update
 */
function validateCheckOut(roomdetailsArr,inputData){
  var statusObj = {
    status:null,
    reason:"",
  };
  var totalPrice = 0 ;
  for(var i=0 ; i < roomdetailsArr.length && inputData.rooms.indexOf(String(roomdetailsArr[i].room)) != -1 ; i++){
    // check in room status
    if(roomdetailsArr[i].bookingStatus != "CHECKED-IN"){
      statusObj.status = false;
      statusObj.reason = "Only CHECKED-IN allowed for the checkout";
      break;
    }
    totalPrice += roomdetailsArr[i].price * utility.dateDiff(roomdetailsArr[i].checkInDate);
  }
  if(statusObj.status == null && totalPrice == (inputData.price + inputData.discount)){
    statusObj.status = true;
    statusObj.reason = "price validated";
  }
  else if(statusObj.status == null){
    statusObj.status = false;
    statusObj.reason = "Price malfunctioned";
  }
  console.log("totalPrice   ",totalPrice);
  return statusObj;
}
/**
 * functionName :createTransactionHistory()
 * Info : transaction,req.body
 * input : used to create the TransactionHistory obj that will save in the TransactionHistory
 * output :TransactionHistory obj
 * createdDate - 30-9-2016
 * updated on -  30-9-2016 // reason for update
 */
function createTransactionHistory(transaction,inputData){
  var historyObj = {}
  historyObj.transaction = transaction._id;
  historyObj.checkInDate = transaction.roomsDetails[0].checkInDate; // as this will be same for all rooms
  historyObj.checkOutDate = new Date(); // as this will be same for all rooms
  historyObj.price = inputData.price;
  historyObj.discount = inputData.discount;
  historyObj.roomDetails = [];
  for(var i=0 ; i < transaction.roomsDetails.length ; i++){
    var roomDetails = {};
    roomDetails.room = transaction.roomsDetails[i].room;
    roomDetails.price = transaction.roomsDetails[i].price;
    roomDetails.isOffer = transaction.roomsDetails[i].isOffer;
    historyObj.roomDetails.push(roomDetails);
  }
  return historyObj;
}
