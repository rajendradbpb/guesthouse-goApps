var constantsObj = require('./../../config/constants');
var responseObj = require('./../component/response');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
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

module.exports = utility;
