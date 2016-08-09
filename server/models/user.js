var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var userSchema = new mongoose.Schema({
    role              : {type: Schema.Types.ObjectId, ref: 'role',required: constants.messages.undefinedRole},
    userName          : {type: String, unique : true},
    password          : {type: String,required: true},
    firstName         : {type: String,required: true},
    middleName        : {type: String},
    lastName          : {type: String},
    createdDate       : {type: Date, default: new Date()},
    createdBy         : {type: Schema.Types.ObjectId, ref: 'user',required: constants.messages.undefinedEntererId},
    updatedDate       : {type: Date, default: new Date()},
    updatedBy         : {type: Schema.Types.ObjectId, ref: 'user' , required: constants.messages.undefinedUpdateUser},
    idDelete          : {type: Boolean, default:false},
});


//custom validations
userSchema.path("userName",function (value) {
  return validator.isNull(value);
},constants.messages.undefined);

userSchema.path("password",function (value) {
  return validator.isNull(value);
},constants.messages.undefined);

userSchema.path("firstName",function (value) {
  return validator.isNull(value);
},constants.messages.undefined);

userSchema.plugin(uniqueValidator, {message: "Username already exists"});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
