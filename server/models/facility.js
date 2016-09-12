var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var facilitySchema = new mongoose.Schema({
    name                    : {type: String, unique:true },
    createdDate             : {type: Date, default: new Date()},
    createdBy               : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    updatedDate             : {type: Date, default: new Date()},
    updatedBy               : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    isDelete                : {type: Boolean, default:false},
});
facilitySchema.plugin(uniqueValidator, {message: constants.messages.errors.facilityExist});
var facilitySchemaModel = mongoose.model('facility', facilitySchema);
module.exports = facilitySchemaModel;
