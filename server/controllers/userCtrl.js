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
try {

  var userModelObj = require("./../models/user");
} catch (e) {
  console.log(colors.red(e));
}

/**
 * get the  confugration Settings Data
 Info - for now it is being fetched from the constants file after this
 we need to create a collection for this that can only accssible by the super admin
 */
 exports.getSettings = function (req, res) {
   var result = {};
   result.roles = constants.roles;
   result.bookingStatus = constants.bookingStatus;
   result.default = constants.default;
   result.roles = constants.roles;
   result.roomFeature = constants.roomFeature;
   return res.json(response(200,"success",constants.messages.success.getData,result));
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
    console.log("query   ",query);
  userModelObj.find(query).exec()
    .then(function(users) {
      return res.json(response(200,"success",constants.messages.success.saveUser,users))
    })
    .catch(function(err) {
      return res.json(response(500,"error",constants.messages.errors.saveUser,err))
    })
}
exports.udpateUser = function (req, res) {
  userModelObj.findOneAndUpdate({"_id":req.user._doc._id},req.body,{"new":true}).exec(function (err,user) {
    if(err)
    {
      return res.json(response(500,"error",constants.messages.errors.saveUser,err))
    }
    else {
      // creating new token with the new user details
      exports.refreshToken2(res,user,constants.messages.success.udpateUser,constants.messages.errors.udpateUser);
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

/**
 * this is used to refreshToken that will hold the latest data updated in the user account
 */
 exports.refreshToken = function (user,callback) {
   try {
     var token = jwt.sign(user, config.token.secret, { expiresIn: config.token.expiry },
       function(token) {
         var data = {
           role:user.role.type,
           token:token,
           user:user
         }
         callback(null,data);
       });
   } catch (e) {
     callback(e,null);
   }
 }
 exports.refreshToken2 = function (res,user,successMsg,errMsg) {
   try {
     userModelObj.populate(user,{path:"role"},function(err,user) {
       if(err)
        throw err;
        else {
          var token = jwt.sign(user, config.token.secret, { expiresIn: config.token.expiry },
            function(token) {
              var data = {
                role:user.role.type,
                token:token,
                user:user
              }
              return res.json(response(200,"success",successMsg ,data));
            });

          }
        })

   } catch (e) {
     return res.json(response(500,"success",errMsg ,e));
   }
 }
/*
* this will be executed if authentication passes
*/
exports.signIn = function (req, res) {
  // creating token that will send to the client side
  try {
    var token = jwt.sign(req.user, config.token.secret, { expiresIn: config.token.expiry },
      function(token) {
        var data = {
          role:req.user.role.type,
          token:token
        }
        return res.json(response(200,"success",constants.messages.success.login,data))
      });
  } catch (e) {
    return res.json(response(500,"error",constants.messages.errors.login,e))
  }
}
/*
* this will be used if the user wants to chagne the password from his dashboard
*/
exports.changePassword = function (req, res) {
  // creating token that will send to the client side
  async.series({
      validatePassword: function(callback) {
          password(req.body.oldPassword).verifyAgainst(req.user._doc.password,function(error, verified) {
              if(error)
                  throw new Error(constants.messages.errors.changePasswordFailed);
              if(!verified) {
                  throw new Error(constants.messages.errors.changePasswordFailed);
              } else {
                console.log("password matched",req.body.oldPassword);
                  callback(null, true);
              }
          });
      },
      createNewPassword: function(callback){
          password(req.body.newPassword).hash(function(error, hash) {
            if(error)
                throw new Error(constants.messages.errors.changePasswordFailed);
            if(!hash) {
                throw new Error(constants.messages.errors.changePasswordFailed);
            } else {
                console.log("password changed",req.body.newPassword);
                callback(null, hash);
            }
          })
      }
    }, function(err, results) {
        if(err){
          return res.json(response(500,"error",constants.messages.errors.changePasswordFailed,err));
        }
        else {
            var query = {
              "_id":req.user._doc._id
            }
            var udpate = {
              "password":results.createNewPassword
            }
            var options = {
              "new":true
            }
            userModelObj.findOneAndUpdate(query,udpate,options)
            .exec(function(err,user) {
              if(err) {
                return  res.json(response(500,"error",constants.messages.errors.changePasswordFailed,err));
              }
              else if (!user) {
                return res.json(response(200,"success","no data found"))
              }
               else {
                exports.refreshToken2(res,user,constants.messages.success.changePassword,constants.messages.errors.changePassword);
              }
            })
        }
    });
}
/*
*  here we are generating the encode str and store it in the user as passwordToken
*  and send the same to the client , while reseting the password user need to send this token
*/
exports.forgetPassword = function (req, res) {
  userModelObj.findOne({"email" : req.body.email}).exec()
  .then(function(user) {
    if(!user){
      throw new Error(constants.messages.errors.noUser);
    }
    else
    {
      // creating , saving token in user and send email verification link
      password(req.body.email+new Date().getTime()).hash(function(error, hash) {
        user.passwordToken = hash;
        user.save(function(err) {
          if(err)
            return res.status(500).json(response(500,"error",constants.messages.errors.forgetPasswordFailed,err));
            else {
              // send the token with the link in the email
              // creating token using salt with the email and time stamp
              password(user.email+ new Date()).hash(function(error, hash) {
                var data = {
                  type :"forgotPassword",
                  email :user.email,
                  firstName : user.firstName,
                  passwordToken : hash
                }
                utility.sendVerificationMail(data,function(err,data) {
                  if(err){
                    // console.log("mail error send  ");
                    return res.status(500).json(response(500,"error",constants.messages.errors.forgetPasswordFailed,err));
                  }
                  else {
                    return res.status(200).json(response(200,"success",constants.messages.success.verificationMailSent));
                  }
                })

              })
            }
        })
      })

    }
  })
  .catch(function(err) {
    res.status(500).json(response(500,"error","Error in forgot password",err));
  })
}

/*
*  here we are generating the encode str and store it in the user as passwordToken
*  and send the same to the client , while reseting the password user need to send this token
*/
exports.resetPassword = function (req, res) {
  userModelObj.findOne({"passwordToken" : req.body.passwordToken}).exec()
  .then(function(user) {
    if(!user){
      console.log("no user found");
      throw new Error(constants.messages.errors.noUser);
    }
    else
    {
      // creating , saving token in user and send email verification link
      password(req.body.password).hash(function(error, hash) {
        user.password = hash;
        user.save(function(err) {
          if(err)
            throw err;
            else {
              res.status(200).json(response(200,"success",constants.messages.success.passwordReset));
            }
        })
      })
    }
  })
  .catch(function(err) {
    res.status(500).json(response(500,"error","Error in forgot password",err));
  })
}
