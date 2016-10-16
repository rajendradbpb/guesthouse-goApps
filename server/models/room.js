var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var roomSchema = new mongoose.Schema({
    guestHouse              : {type: Schema.Types.ObjectId, ref: 'user' , required: constants.messages.errors.ghNameRequired},
    roomNo                  : {type: String, required: constants.messages.errors.roomNoRequired},
    roomType                : {type: String, required:constants.messages.errors.roomTypeRequired},
    price                   : {type: Number,required: constants.messages.errors.ghPriceRequired},
    isOffer                 : {type: Boolean, default:false},
    offerPrice              : {type: Number, default:null},
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

// validaton gose here
roomSchema.plugin(uniqueValidator, {message: constants.messages.errors.guestHouseExist});
roomSchema.plugin(deepPopulate, {
  whitelist: [
    'guestHouse',
    'facility'
  ],
  populate: {
    'guestHouse': {
      select: 'email firstName lastName middleName minPrice maxPrice mobile establishDate address',
    },
    'facility': {
      select: 'name',
    },
  }
});

/**
 * functionName :preSave()
 * Info : used to validate before savae
 * input : req - request object ,
 * output : cb- callback with error and response
 * createdDate - 16-10-2016
 * updated on -  16-10-2016
 */
roomSchema.statics.preSave = function search (req, cb) {
  roomSchemaModel.findOne({roomNo:req.body.roomNo,guestHouse:req.body.guestHouse}).exec()
  .then(function(room) {
    if(!room){
      console.log("room not found");
    cb(null,true);
    }
    else {
      var err = new Error(constants.messages.errors.roomNoExist);
      cb(err,null);
    }
  })
  .catch(function(error) {
    cb(error,null);
  })

}
// pre save room
// roomSchema.pre('save', function(next) {
//   console.log("presave of the room",this);
//   // before saving check wheather the room already added or not for this guest house
//   roomSchemaModel.findOne({roomNo:this.roomNo,guestHouse:this.guestHouse}).exec()
//   .then(function(room) {
//     if(!room){
//       console.log("room not found");
//       next();
//     }
//     else {
//       var err = new Error('Room No already present');
//       next(err);
//     }
//   })
//   .catch(function(error) {
//     next(error);
//   })
// });
var roomSchemaModel = mongoose.model('room', roomSchema);



module.exports = roomSchemaModel;
