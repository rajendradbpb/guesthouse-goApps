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
  checkInDate       : {type:Date , required:constants.messages.errors.checkInDateRequired },
  checkOutDate      : {type:Date , required:constants.messages.errors.checkOutDateRequired}, // will be updated at checkOut
  cancelDate      : {type:Date , default:null},
  price             : {type:Number , default:null }, // here the price may the original or the offer price
  isOffer           : {type:Boolean , default:false  }, // checks the offer price or not
  bookingStatus     : {type: String, enum: constants.bookingStatus, required:constants.messages.errors.bookingStatusRequired},
})
var tranctionSchema = new mongoose.Schema({
    otp               : {type: String, default:null },
    cName             : {type: String, required:constants.messages.errors.nameRequired },
    cMobile           : {type: String, required:constants.messages.errors.mobileRequired },
    address           : {type: String, required:constants.messages.errors.addressRequired },
    roomsDetails      : [roomDetailsSchema],
    identity          : {type: String, required:constants.messages.errors.IDproofRequired },
    idproofno         : {type: String },
    purpose           : {type: String, default:null },
    discount          : {type: String,default:null },
    // price             : {type: Number, required:constants.messages.errors.priceRequired},// this will be updated 2nd time when the user will be check out
    // isPayment         : {type: Boolean, default:false}, // this will be true in case of the checkOut
    transactionNo       : {type:String , required:constants.messages.errors.tranctionNoRequired},
    createdDate       : {type: Date, default: null},
    // checkInDate       : {type: Date, required:constants.messages.errors.checkInDateRequired , default:Date()},
    // checkOutDate      : {type: Date, default: null},
    createdBy         : {type: Schema.Types.ObjectId ,ref: 'user', required:"user id not mentioned"}, // this is be the ghUser always
    guestHouse        : {type: Schema.Types.ObjectId, ref: 'user', required:constants.messages.errors.guestHouseRequried },
    updatedDate       : {type: Date, default: new Date()},
    updatedBy         : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    isDelete          : {type: Boolean, default:false},
});
tranctionSchema.plugin(uniqueValidator, {message: constants.messages.errors.tranctionNoExist});
tranctionSchema.plugin(deepPopulate, {
  whitelist: [
    'createdBy',
    'roomsDetails.room'
  ],
  populate: {
    'createdBy': {
      select: 'guestHouseName email  mobile  address',
    },
    'roomsDetails.room': {
      select: 'roomNo',
    },
  }
});

/**
 * functionName :preSave()
 * Info : used to validate before save
 * input : req - request object ,
 * output : cb- callback with error and response
 * createdDate - 16-10-2016
 * updated on -  16-10-2016
 */
tranctionSchema.statics.preSave = function search (req, cb) {
  var query = {
    guestHouse:req.body.guestHouse,
    transactionNo : req.body.transactionNo
  }
  console.log("tranctionSchema.statics.preSave",query);
  tranctionSchemaSchemaModel.findOne(query).exec()
  .then(function(transaction) {
    if(!transaction){
      console.log("transaction not found");
      return cb(null,true);
    }
    else {
      console.log("transaction  found");
      var err = new Error(constants.messages.errors.tranctionNoExist);
      return cb(err,null);
    }
  })
  .catch(function(error) {
      console.log("transaction  err");
    return cb(error,null);
  })

}
var tranctionSchemaSchemaModel = mongoose.model('tranction', tranctionSchema);
module.exports = tranctionSchemaSchemaModel;
