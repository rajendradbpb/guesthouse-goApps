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

try {

  var userModelObj = require("./../models/user");
} catch (e) {
  console.log(colors.red(e));
}
/*
* user crud operation starts
*/
exports.addUser = function (req, res) {
  try {
    password(req.body.password).hash(function(error, hash) {
      req.body.password = hash; // encrypting the password
      userModelObj(req.body).save(function (err, user) {
        if(err)
        {
          return res.json(response(500,"error",constants.messages.errors.saveUser,err))
        }
        else {
          return res.json(response(200,"success",constants.messages.success.saveUser))
        }
      });
    })
  } catch (err) {
    return res.json(response(500,"error",constants.messages.errors.saveUser,err))
  }
}
exports.getUser = function (req, res) {
  var query = {
    "isDelete" : false
  };
  if(req.params.id)
    query._id = req.params.id;
  userModelObj.find(query).exec()
    .then(function(users) {
      return res.json(response(200,"success",constants.messages.success.saveUser))
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.saveUser,err))
    })
}
exports.updateUser = function (req, res) {
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
exports.deleteUser = function (req, res) {
  userModelObj.findOneAndUpdate({"_id":req.body.id},{"isDelete":true},{"new" :true})
  exec()
  .then(function(user) {
    res.json(response(200,"success",constants.messages.success.deleteUser));
  })
  .catch(function(err) {
    res.json(response(500,"error",constants.messages.errors.deleteUser,err))
  });
}
/*
* user crud operation ends
*/

/*
* this will be executed if authentication passes
*/
exports.signIn = function (req, res) {
  // creating token that will send to the client side
  try {
    var token = jwt.sign(req.user, config.token.secret, { expiresIn: config.token.expiry },
      function(token) {
        res.json(response(200,"success",constants.messages.success.login,token))
      });
  } catch (e) {
    res.json(response(500,"error",constants.messages.errors.login,e))
  }
}
