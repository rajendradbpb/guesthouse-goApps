var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require('./../config/constants');
var userSchema = new mongoose.Schema({
    type              : {type: String , required:true, enum: constants.models},
    CreatedDate       : {type: Date, default: new Date()},
    // CreatedBy               // this is the main master table  --- NA
    // UpdatedDate             // this is the main master table  --- NA
    // UpdatedBy               // this is the main master table  --- NA
    idAdmin       : {type: Boolean, default:false},
    idDelete       : {type: Boolean, default:false},

});

//custom validations

// userSchema.path('accountSetting.firstName').validate(function (value) {
//     var validateExpression = validations.validateRegex.alphabetNumericSpaces;
//     return validateExpression.test(value);
// }, "Please enter valid firstName");


// userSchema.plugin(uniqueValidator, {message: "Username already exists"});

var userModel = mongoose.model('role', userSchema);
module.exports = userModel;
