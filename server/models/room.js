var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var roomSchema = new mongoose.Schema({
    guestHouse              : {type: Schema.Types.ObjectId, ref: 'user' , required: constants.messages.errors.ghNameRequired},
    roomNo                  : {type: String, required: constants.messages.errors.roomNoRequired},
    roomType                : {type: String, enum: constants.roomType },
    price                   : {type: Number,required: constants.messages.errors.ghPriceRequired},
    facility                : [{type: Schema.Types.ObjectId, ref: 'facility'}],
    capacity                : {type: Number,default:1},
    bookingStatus           : {type: String, enum: constants.bookingStatus, default:'AVAILABLE'},
    bookedOn                : {type: Date},
    bookedDate              : {type: Date},
    bookedExpiry            : {type: Schema.Types.ObjectId, ref: 'user' },
    bookedBy                : {type: Schema.Types.ObjectId, ref: 'user' },
    bookedFor               : {type: Schema.Types.ObjectId, ref: 'customer' },
    createdDate             : {type: Date, default: new Date()},
    createdBy               : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    updatedDate             : {type: Date, default: new Date()},
    updatedBy               : {type: Schema.Types.ObjectId , required:"user id not mentioned"},
    isDelete                : {type: Boolean, default:false},

});

roomSchema.plugin(uniqueValidator, {message: constants.messages.errors.guestHouseExist});
roomSchema.plugin(deepPopulate, {
  whitelist: [
    'guestHouse',
  ],
  populate: {
    'guestHouse': {
      select: 'email firstName lastName middleName minPrice maxPrice mobile establishDate address',
    },
  }
});
var roomSchemaModel = mongoose.model('room', roomSchema);
module.exports = roomSchemaModel;
