var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var transactionHistorySchema = new mongoose.Schema({
  transaction        : {type: Schema.Types.ObjectId, ref: 'transaction', required:constants.messages.errors.transactionRequried },
  rooms              : [{type: Schema.Types.ObjectId, ref: 'room', required:constants.messages.errors.roomIdRequired }],
  price             : {type:Number , default:null }, // here the price may the original or the offer price
  discount             : {type:Number , default: 0 }, // here the price may the original or the offer price
  createdBy         : {type: Schema.Types.ObjectId ,ref: 'user', required:"user id not mentioned"}, // this is be the ghUser always
  updatedDate       : {type: Date, default: new Date()},
  updatedBy         : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
  isDelete          : {type: Boolean, default:false},
})

transactionHistorySchema.plugin(deepPopulate, {
  whitelist: [
    'transaction'

  ],
  populate: {
    'transaction': {
      // select: 'guestHouseName email  mobile  address',
    }
  }
});
var transactionHistoryModel = mongoose.model('tranctionHistory', transactionHistorySchema);
module.exports = transactionHistoryModel;
