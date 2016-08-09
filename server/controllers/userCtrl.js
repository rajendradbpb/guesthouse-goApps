
var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var response = require("./../component/response");
//add user
exports.addUser = function (req, res) {
  userModelObj(req.body).save(function (err, user) {
    if(err)
    {
      return res.json(response(500,"error",constants.messages.errors.saveUser,err))
    }
    else {
      return res.json(response(200,"success",constants.messages.success.saveUser))
    }
  });


}
