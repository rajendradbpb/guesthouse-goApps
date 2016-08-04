var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../config/constants');
var Schema = mongoose.Schema;
var userSchema = new mongoose.Schema({
    role              : {type: Schema.Types.ObjectId, ref: 'role',required: true},
    userName          : {type: String, unique : true},
    password      : {type: String,required: true},
    firstName         : {type: String,required: true},
    middleName        : {type: String},
    lastName          : {type: String},
    createdDate       : {type: Date, default: new Date()},
    createdBy         : {type: Schema.Types.ObjectId, ref: 'user',required: true},
    updatedDate       : {type: Date, default: new Date()},
    updatedBy         : {type: Schema.Types.ObjectId, ref: 'user' , required: true},
    idDelete       : {type: Boolean, default:false},
});

//custom validations

// userSchema.path('accountSetting.firstName').validate(function (value) {
//     var validateExpression = validations.validateRegex.alphabetNumericSpaces;
//     return validateExpression.test(value);
// }, "Please enter valid firstName");


// userSchema.plugin(uniqueValidator, {message: "Username already exists"});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
