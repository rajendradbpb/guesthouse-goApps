var constantsObj = require('./../../config/constants');
var responseObj = require('./../component/response');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var moment = require('moment');
var utility = {};
utility.sendVerificationMail = function(userObj,callback) {
  var transporter = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: constantsObj.gmailSMTPCredentials.username,
      pass: constantsObj.gmailSMTPCredentials.password
    }
});
// udpate data as per the user input
  var mailOptions = {
    from: constantsObj.gmailSMTPCredentials.mailUsername+"<"+constantsObj.gmailSMTPCredentials.verificationMail+">",
    // to: userObj.email,
    to: userObj.email,
    subject: constantsObj.mailFormat[userObj.type].subject,
    text: constantsObj.mailFormat[userObj.type].content
          .replace("{{name}}",userObj.firstName)
          .replace("{{link}}",constantsObj.mailFormat[userObj.type].link)
          .replace("{{passwordToken}}",userObj.passwordToken)


  }
  transporter.sendMail(mailOptions,function(err,response) {
    if(err){
        console.log("Message sent: Error" + err.message);
        callback(responseObj(500,"error",constantsObj.messages.errors.emailVerifiedError,err))
    }else{
        console.log("Message sent: " + response);
        callback(null,responseObj(200,"success",constantsObj.messages.errors.emailVerifiedSuccess))
    }
  });
}
/**
 * functionName :utility.stringify()
 * Info : used to stringify the content of the object or the array of object
 * input : object or the array of object
 * output :string
 * createdDate - 22-9-16
 * updated on - 22-9-16
 */
utility.stringify = function(objData) {
  return JSON.stringify(objData);
}
/**
 * functionName :utility.getDateFormat()
 * Info : used to get the calculated date from the given paramereres with the format
 * @param
      operation - date operaton like add,substract
      startDate - start date of the calculation
      mode      - mode of calculation like day , hour etc
      count     - count to of the operation
 * output :string
 * createdDate - 24-9-16
 * updated on - 24-9-16
 */
utility.getDateFormat = function(objData) {
  var formatDate = null;
  switch (objData.operation) {
    case 'add':
      formatDate =  moment(new Date(objData.startDate)).add(objData.mode,objData.count).format()
      break;
    default:
      console.log("getDateFormat  not mentioned ");
  }
  return new Date(formatDate); // here we converted to the javascript format as mongo db do not recognise momoment format
}

/**
 * functionName :utility.dateDiff()
 * Info : used to get the date difference
 * @param
      startDate , end date
 * output :Number
 * createdDate - 01-10-16
 * updated on - 01-10-16
 */
utility.dateDiff = function(startDate,endDate) {
  startDate = moment(new Date(startDate));
  endDate   = endDate ? moment(new Date(endDate)) : moment(new Date());
  var days = endDate.diff(startDate, 'days');
  days = days || 1;
  console.log("days  ",days);
  return days;
}
/**
 * functionName :utility.isDataExist()
 * Info : to check wheather data present or blank , where checking ZERo optional
 * @param
      data - variable to be check
      isZero - check condition for the zero
 * output :Number
 * createdDate - 16-10-2016
 * updated on - 16-10-2016
 */
utility.isDataExist = function(data,isZero) {
  var status = true;
  if(data == undefined || data == null){
    status = false;
  }
  if(isZero){
    status = data == 0 ? false : true;
  }
  return status;
}
module.exports = utility;
