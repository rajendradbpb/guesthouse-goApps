var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * SchemaName :roomDetailsSchema
 * Info : used to keep each room information of the transaction
         type is array as each room may have differnet set of the data during check in and check out
 *
 * createdDate - 21-9-2016
 * updated on -  21-9-2016 // reason for update
 */
var roomDetailsSchema = new mongoose.Schema({
  room              : {type: Schema.Types.ObjectId, ref: 'room', required:constants.messages.errors.roomIdRequired },
  price             : {type:Number , default:null }, // here the price may the original or the offer price
  isOffer           : {type:Boolean , default:false  }, // checks the offer price or not
})
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
  roomDetails              : [{roomDetailsSchema}],
  checkInDate       : {type:Date , required:constants.messages.errors.dateRequired },// will be same for all rooms under this
  checkOutDate      : {type:Date , required:constants.messages.errors.dateRequired },// will be same for all rooms under this
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
