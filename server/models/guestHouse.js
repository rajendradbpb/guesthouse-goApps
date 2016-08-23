var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var guestHouseSchema = new mongoose.Schema({
    user                      : {type: Schema.Types.ObjectId, ref: 'user' , required: constants.messages.errors.userRequired},
    name                      : {type: String, required: constants.messages.errors.ghNameRequired , unique:true},
    contactDetails            : {
      mobile : [type: String], // here both could be array type
      phone : [type: String]
    },
    establishDate             : {type: Date},
    rooms                     : [{type: Schema.Types.ObjectId, ref: 'room'}],
    rating                    : {type: Number},
    MinPrice                  : {type: Number ,required: constants.messages.errors.lowerLimitRequired},
    MaxPrice                  : {type: Number ,required: constants.messages.errors.upperLimitRequired},
    address                   :{
      city                    :{type: String},
      district                :{type: String},
      state                   :{type: String,default:constants.default.state},
      pincode                 :{type: String},
      country                 :{type: String,default:constants.default.country},
    },
    createdDate               : {type: Date, default: new Date()},
    createdBy                 : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    updatedDate               : {type: Date, default: new Date()},
    updatedBy                 : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    isDelete                  : {type: Boolean, default:false},

});

guestHouseSchema.plugin(uniqueValidator, {message: constants.messages.errors.guestHouseExist});

var guestHouseModel = mongoose.model('guestHouse', guestHouseSchema);
module.exports = guestHouseModel;
