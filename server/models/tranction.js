var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var tranctionSchema = new mongoose.Schema({
    otp                    : {type: String, default:null },
    cName                    : {type: String, required:constants.messages.errors.nameRequired },
    cMobile             : {type: String, required:constants.messages.errors.mobileRequired },
    address             : {type: String, required:constants.messages.errors.addressRequired },
    rooms             : [{type: Schema.Types.ObjectId, ref: 'room', required:constants.messages.errors.roomIdRequired }],
    price             : {type: Number, required:constants.messages.errors.priceRequired},
    tranctionNo             : {type:String , required:constants.messages.errors.tranctionNoRequired},

    createdBy               : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    updatedDate             : {type: Date, default: new Date()},
    updatedBy               : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    isDelete                : {type: Boolean, default:false},

});

// facilitySchema.plugin(uniqueValidator, {message: constants.messages.errors.facilityExist});

var tranctionSchemaSchemaModel = mongoose.model('tranction', tranctionSchema);
module.exports = tranctionSchemaSchemaModel;
