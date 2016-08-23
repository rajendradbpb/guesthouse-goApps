var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var password = require('password-hash-and-salt');
var jwt     = require('jsonwebtoken');
var config = require("config");
var waterfall = require('async-waterfall');
var async = require('async');
var utility = require('./../component/utility');
var customerModelObj = require("./../models/customer");
try {

} catch (e) {
  console.log(colors.red(e));
}
/*
* user crud operation starts
*/
exports.addCustomer = function (req, res) {
  try {
    req.body.createdBy = req.body.updatedBy = req.user._doc._id;
    customerModelObj(req.body).save(function (err, user) {
      if(err)
      {
        return res.json(response(500,"error",constants.messages.errors.saveCustomer,err))
      }
      else {
        return res.json(response(200,"success",constants.messages.success.saveCustomer))
      }
    });
  } catch (err) {
    return res.json(response(500,"error",constants.messages.errors.saveUser,err))
  }
}
exports.getCustomer = function (req, res) {
  var query = {
    "isDelete" : false
  };
  if(req.query.mobile)
    query.mobile = req.query.mobile;
  if(req.query.id)
    query._id = req.query.id;
  customerModelObj.find(query).exec()
    .then(function(customers) {
      return res.json(response(200,"success",constants.messages.success.getCustomer,customers))
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.getCustomer,err))
    })
}
exports.udpateCustomer = function (req, res) {
  req.body.updatedBy = req.user._doc._id;
  req.body.updatedDate = new Date();
  customerModelObj.findOneAndUpdate({"_id":req.body._id},req.body,{"new":true}).exec(function (err,user) {
    if(err)
    {
      return res.json(response(500,"error",constants.messages.errors.saveUser,err))
    }
    else if (!user) {
      return res.json(response(202,"success",constants.messages.errors.noUser))
    }
    else {
      // creating new token with the new user details
      return res.json(response(200,"success",constants.messages.success.saveUser))
    }
  });
}
exports.deleteCustomer = function (req, res) {
  req.query.updatedBy = req.user._doc._id;
  req.query.updatedDate = new Date();
  customerModelObj.findByIdAndUpdate(req.query._id,{"isDelete":true},{"new" :true})
  .exec()
  .then(function(data) {
    return res.json(response(200,"success",constants.messages.success.deleteUser));
  })
  .catch(function(err) {
    return res.json(response(500,"error",constants.messages.errors.deleteUser,err))

  })
  // customerModelObj.findByIdAndUpdate(req.body._id,{"isDelete":true},{"new" :true})
  // exec()
  // .then(function(user) {
  //   res.json(response(200,"success",constants.messages.success.deleteUser));
  // })
  // .catch(function(err) {
  //   res.json(response(500,"error",constants.messages.errors.deleteUser,err))
  // });
}
/*
* user crud operation ends
*/
