var express = require('express');
var mongoose = require('mongoose');
var colors = require('colors');
mongoose.Promise = require('q').Promise;
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var response = require("./../component/response");
var roleModel = require("./../models/role");
var constants = require("./../../config/constants");
/*
  CRUD for the roles starts
*/
exports.addRole = function (req, res) {
  new roleModel(req.body).save().then(function (response) {
    console.log("success");
  }).catch(function(err){
    console.log("error",err);
  });
}
exports.getRole = function (req, res) {
  roleModel.find({"idDelete":false}).exec()
  .then(function(roles){
    res.json(response(200,"success",constants.messages.success.fetchRoles,roles))
  })
  .catch(function(err) {
    console.error(colors.red("error in getting roles"));
    res.json(response(500,"error",constants.messages.error.fetchRoles,err))
  })
}
exports.deleteRole = function (req, res) {
  roleModel.findOneAndUpdate({"_id":req.body.id},{"isDelete":true},{"new" :true},function(err,data) {
    if(err)
      res.json(response(500,"error",constants.messages.errors.deleteRole,err))
    else
      res.json(response(200,"success",constants.messages.success.deleteRole));
  })
}
exports.udpateRole = function (req, res) {
  var query = {
    "_id":req.body.id
  };
  // adding fields conditionally for udpate
  var udpate = {};
  if(req.body.type)
    udpate.type = req.body.type;
  if(req.body.type && req.body.type == "admin")
    udpate.idAdmin = true;
  if(req.body.idDelete)
    udpate.idDelete = true;
  var options = {
    "new" :true
  }
  roleModel.findOneAndUpdate(query, update, options).exec()
  .then(function(res) {
    res.json(response(200,"success",constants.messages.success.udpateRole,roles));
  })
  .catch(function(err) {
    res.json(response(500,"error",constants.messages.error.udpateRole,err))
  })
}
/*
  CRUD for the roles ends
*/
