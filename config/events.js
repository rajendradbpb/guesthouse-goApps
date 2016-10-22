/**
 * This is used to perform specific task on event occured in the server end
 Note: for this it need to be "require" in that file
 * createdDate - 22-10-2016
 * updated on -  22-10-2016
 */
var autowire = require("./autowire");
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
// if any error event occures
myEmitter.on('error', () => {
  autowire.wire("logger").log("error","an error event occurred!")
});
exports.getEmitter = function() {
  return myEmitter;
};
