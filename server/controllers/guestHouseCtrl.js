var colors = require('colors');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var password = require('password-hash-and-salt');
var config = require("config");
var guestHouseModelObj = require("./../models/guestHouse");
var roomModelObj = require("./../models/room");

/*
* guest house crud operation starts
*/
exports.addGuestHouse = function (req, res) {
    req.body.createdBy = req.body.updatedBy = req.user._doc._id;
    guestHouseModelObj(req.body).save(function (err, user) {
      if(err)
      {
        return res.json(response(500,"error",constants.messages.errors.saveGuestHouse,err))
      }
      else {
        return res.json(response(200,"success",constants.messages.success.saveGuestHouse))
      }
    });
}
exports.getGuestHouse = function (req, res) {
  var query = {
    "isDelete" : false
  };
  // validating data as per the user requested
  var select = {};
  // no condition as admin can access all
  if(req.user._doc.role.type == "ccare"){
    select = "name  contactDetails establishDate rating MinPrice MaxPrice address";
  }
  else if(req.user._doc.role.type == "ghUser"){
    select = "name  contactDetails rooms establishDate rating MinPrice MaxPrice address";
  }
  guestHouseModelObj.find(query).select(select).exec()
    .then(function(guestHouse) {
      return res.json(response(200,"success",constants.messages.success.getCustomer,guestHouse))
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.getCustomer,err))
    })
}
exports.udpateGuestHouse = function (req, res) {
  var id = req.body._id;
  delete req.body['_id']; //  removed to avoid the _id mod error
  req.body.updatedBy = req.user._doc._id;
  req.body.updatedDate = new Date();
  guestHouseModelObj.findOneAndUpdate({"_id":id},req.body,{"new":true}).exec(function (err,guestHouse) {
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
exports.deleteGuestHouse = function (req, res) {
  req.query.updatedBy = req.user._doc._id;
  req.query.updatedDate = new Date();
  console.log(">>>>>>>>>>>>>  ",req.body);
  guestHouseModelObj.findByIdAndUpdate(req.body._id,{"isDelete":true},{"new" :true})
  .exec()
  .then(function(data) {
    return res.json(response(200,"success",constants.messages.success.deleteData));
  })
  .catch(function(err) {
    return res.json(response(500,"error",constants.messages.errors.deleteData,err))
  })
}
/*
* guest house crud operation ends
*/




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
exports.getGuestHouse = function (req, res) {
  var query = {
    "isDelete" : false
  };
  // validating data as per the user requested
  var select = {};
  // no condition as admin can access all
  if(req.user._doc.role.type == "ccare"){
    select = "name  contactDetails establishDate rating MinPrice MaxPrice address";
  }
  else if(req.user._doc.role.type == "ghUser"){
    select = "name  contactDetails rooms establishDate rating MinPrice MaxPrice address";
  }
  guestHouseModelObj.find(query).select(select).exec()
    .then(function(guestHouse) {
      return res.json(response(200,"success",constants.messages.success.getCustomer,guestHouse))
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.getCustomer,err))
    })
}
exports.udpateGuestHouse = function (req, res) {
  var id = req.body._id;
  delete req.body['_id']; //  removed to avoid the _id mod error
  req.body.updatedBy = req.user._doc._id;
  req.body.updatedDate = new Date();
  guestHouseModelObj.findOneAndUpdate({"_id":id},req.body,{"new":true}).exec(function (err,guestHouse) {
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
exports.deleteGuestHouse = function (req, res) {
  req.query.updatedBy = req.user._doc._id;
  req.query.updatedDate = new Date();
  console.log(">>>>>>>>>>>>>  ",req.body);
  guestHouseModelObj.findByIdAndUpdate(req.body._id,{"isDelete":true},{"new" :true})
  .exec()
  .then(function(data) {
    return res.json(response(200,"success",constants.messages.success.deleteData));
  })
  .catch(function(err) {
    return res.json(response(500,"error",constants.messages.errors.deleteData,err))
  })
}
/*
* guest house crud operation ends
*/
