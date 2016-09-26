var colors = require('colors');
var mongoose = require('mongoose');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var password = require('password-hash-and-salt');
var config = require("config");
var tranctionModelObj = require("./../models/tranction");
var roomModelObj = require("./../models/room");
var DateOnly = require('mongoose-dateonly')(mongoose);
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

exports.udpateTranction = function (req, res) {
  var id = req.body._id;
  delete req.body['_id']; //  removed to avoid the _id mod error
  req.body.updatedBy = req.user._doc._id;
  req.body.checkOutDate = req.body.checkOutDate || new Date();
  req.body.isPayment = true;

  if(req.body.type == "checkOut"){
      tranctionModelObj.findOneAndUpdate({"_id":id},req.body,{"new":true}).exec(function (err,transaction) {
      if(err)
      {
        return res.json(response(500,"error",constants.messages.errors.updateData,err))
      }
      else if (!transaction) {
        return res.json(response(202,"success",constants.messages.errors.noData))
      }
      else {
        // update the room status to AVAILABLE
        console.log("transaction updated");

        var query = {
          "_id": { "$in": req.body.rooms },
        };
        var update = {
            "bookingStatus" : "AVAILABLE"
        };
        var options = {
          "new" : true,
          "multi":true
        };
        roomModelObj.update(query,update,options).exec(function(err,updatedRooms) {
          if(err)
          {
            return res.json(response(500,"error",constants.messages.errors.updateData,err))
          }
          else if (!updatedRooms) {
            return res.json(response(202,"success",constants.messages.errors.noData))
          }
          else {
            // creating new token with the new user details
            return res.json(response(200,"success",constants.messages.success.updateData))
          }
        })
      }
    });
  }
  else {
    return res.json(response(402,"failed",constants.messages.errors.noOperation))
  }
}
