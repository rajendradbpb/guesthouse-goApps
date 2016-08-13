var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var password = require('password-hash-and-salt');
var userSchema = new mongoose.Schema({
    role              : {type: Schema.Types.ObjectId, ref: 'role',required: constants.messages.errors.undefinedRole},
    userName          : {type: String, unique : true,required: constants.messages.errors.undefinedUsername},
    password          : {type: String,required: constants.messages.errors.undefinedPassword},
    firstName         : {type: String,required: constants.messages.errors.undefinedFirstName},
    middleName        : {type: String},
    lastName          : {type: String},
    createdDate       : {type: Date, default: new Date()},
    createdBy         : {type: Schema.Types.ObjectId /*, ref: 'user',required: constants.messages.undefinedEntererId*/},
    updatedDate       : {type: Date, default: new Date()},
    updatedBy         : {type: Schema.Types.ObjectId /*, ref: 'user' , required: constants.messages.undefinedUpdateUser*/},
    idDelete          : {type: Boolean, default:false},
    accessToken          : {type: String, default:null},
});

userSchema.methods.verifyPassword = function(password) {
  return this.userName == password ? true : false;
}
//custom validations
// userSchema.path('userName').validate(function (value) {
//     var test = validator.isNull(value) || value == undefined ? false : true;
//     console.log("test valies  ",test);
//     return test;
// }, constants.messages.errors.undefinedUsername);
// userSchema.path('password').validate(function (value) {
//   var test = validator.isNull(value) || value == undefined ? false : true;
//   return test;
// }, constants.messages.errors.undefinedPassword);
// userSchema.path('firstName').validate(function (value) {
//   var test = validator.isNull(value) || value == undefined ? false : true;
//   return test;
// }, constants.messages.errors.undefinedFirstName);
userSchema.plugin(uniqueValidator, {message: "Username already exists"});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
