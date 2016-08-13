var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var constants = require('./../../config/constants');
var roleSchema = new mongoose.Schema({
    type              : {type: String,unique:true,enum: constants.role },
    CreatedDate       : {type: Date, default: new Date()},
    idAdmin       : {type: Boolean, default:false},
    idDelete       : {type: Boolean, default:false},
});
roleSchema.plugin(uniqueValidator, {message: "Role already exists"});
var roleModel = mongoose.model('role', roleSchema);
module.exports = roleModel;
