var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var tranctionSchema = new mongoose.Schema({
    otp                    : {type: String, default:null },
    cName                    : {type: String, required:constants.messages.errors.nameRequired },
    cMobile             : {type: String, required:constants.messages.errors.mobileRequired },
    address             : {type: String, required:constants.messages.errors.addressRequired },
    rooms             : [{type: Schema.Types.ObjectId, ref: 'room', required:constants.messages.errors.roomIdRequired }],
    identity          : {type: String, required:constants.messages.errors.IDproofRequired },
    discount          : {type: String },
    price             : {type: Number, required:constants.messages.errors.priceRequired},// this will be updated 2nd time when the user will be check out
    isPayment           : {type: Boolean, default:false}, // this will be true in case of the checkOut
    tranctionNo             : {type:String , required:constants.messages.errors.tranctionNoRequired,unique:true},
    createdDate       : {type: Date, default: null},
    checkInDate       : {type: Date, required:constants.messages.errors.checkInDateRequired , default:Date()},
    checkOutDate       : {type: Date, default: null},
    createdBy               : {type: Schema.Types.ObjectId ,ref: 'user', required:"user id not mentioned"}, // this is be the ghUser always
    updatedDate             : {type: Date, default: new Date()},
    updatedBy               : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    isDelete                : {type: Boolean, default:false},

});

tranctionSchema.plugin(uniqueValidator, {message: constants.messages.errors.tranctionNoExist});
tranctionSchema.plugin(deepPopulate, {
  whitelist: [
    'createdBy',
    'rooms'
  ],
  populate: {
    'createdBy': {
      select: 'guestHouseName email  mobile  address',
    },
    'rooms': {
      select: 'roomNo',
    },
  }
});
var tranctionSchemaSchemaModel = mongoose.model('tranction', tranctionSchema);
module.exports = tranctionSchemaSchemaModel;
