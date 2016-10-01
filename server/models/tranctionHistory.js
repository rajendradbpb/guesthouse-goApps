var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var transactionHistorySchema = new mongoose.Schema({
  transaction        : {type: Schema.Types.ObjectId, ref: 'tranction', required:constants.messages.errors.transactionRequried },
  transactionType    : {type: String, enum: constants.bookingStatus, required:constants.messages.errors.bookingStatusRequired},
  rooms              : [{type: Schema.Types.ObjectId, ref: 'room', required:constants.messages.errors.roomIdRequired }],
  price             : {type:Number , default:null }, // here the price may the original or the offer price
  discount             : {type:Number , default: 0 }, // here the price may the original or the offer price
  createdDate       : {type: Date, default: new Date()},
  updatedDate       : {type: Date, default: new Date()},
  createdBy         : {type: Schema.Types.ObjectId ,ref: 'user', required:"user id not mentioned"}, // this is be the ghUser always
  updatedBy         : {type: Schema.Types.ObjectId ,ref: 'user' ,required:"user id not mentioned"},
  isDelete          : {type: Boolean, default:false},
})

transactionHistorySchema.plugin(deepPopulate, {
  whitelist: [
    'transaction'

  ],
  // populate: {
  //   'transaction': {
  //
  //   }
  // }
});
var transactionHistoryModel = mongoose.model('tranctionHistory', transactionHistorySchema);
module.exports = transactionHistoryModel;
