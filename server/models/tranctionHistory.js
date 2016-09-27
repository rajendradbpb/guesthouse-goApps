var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
/**
 * SchemaName :transactionHistorySchema
 * Info : used to keep the history of the transaction after the check out
          here the transaction that are check out will deleted from the transaction
          table and inserted in this table , and make the room to AVAILABLE
 *
 * createdDate - 28-9-2016
 * updated on -  28-9-2016 // reason for update
 */
var transactionHistorySchema = new mongoose.Schema({
  transaction        : {type: Schema.Types.ObjectId, ref: 'transaction', required:constants.messages.errors.transactionRequried },
  roomArr              : [{type: Schema.Types.ObjectId, ref: 'room', required:constants.messages.errors.roomIdRequired }],
  checkInDate       : {type:Date , required:constants.messages.errors.dateRequired },
  checkOutDate      : {type:Date , required:constants.messages.errors.dateRequired },
  price             : {type:Number , default:null }, // here the price may the original or the offer price
  discount             : {type:Number , default: 0 }, // here the price may the original or the offer price
})

transactionHistorySchema.plugin(deepPopulate, {
  whitelist: [
    'transaction',
    'roomArr'
  ],
  populate: {
    'transaction': {
      // select: 'guestHouseName email  mobile  address',
    },
    'roomArr': {
      select: 'roomNo',
    },
  }
});
var transactionHistoryModel = mongoose.model('tranctionHistory', transactionHistorySchema);
module.exports = transactionHistoryModel;
