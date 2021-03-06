var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var password = require('password-hash-and-salt');
var customerSchema = new mongoose.Schema({
    // role              : {type: Schema.Types.ObjectId, ref: 'role',required: constants.messages.errors.undefinedRole},
    // userName          : {type: String, unique : true,required: constants.messages.errors.undefinedUsername},
    // password          : {type: String,required: constants.messages.errors.undefinedPassword},
    email         : {type: String,required: constants.messages.errors.undefinedEmail},
    mobile         : {type: String,required: constants.messages.errors.undefinedMobile,unique : true},
    firstName         : {type: String,required: constants.messages.errors.undefinedFirstName},
    middleName        : {type: String},
    lastName          : {type: String},
    createdDate       : {type: Date, default: new Date()},
    createdBy         : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    updatedDate       : {type: Date, default: new Date()},
    updatedBy         : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    isDelete          : {type: Boolean, default:false},
    // passwordToken          : {type: String, default:null},
    // isAdmin          : {type:Boolean,default:false },
    address:{
      city :{type: String},
      district :{type: String},
      state :{type: String,default:constants.default.state},
      pincode :{type: String},
      country :{type: String,default:constants.default.country},
    }


});
customerSchema.plugin(uniqueValidator, {message: "Mobile already exists"});

var customerModel = mongoose.model('customer', customerSchema);
module.exports = customerModel;
