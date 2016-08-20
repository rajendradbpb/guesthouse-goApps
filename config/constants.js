var config = require('config');
var constants = {
  roles : ["admin","ccare","ghUser","ghAdmin"],
  messages:{
    errors:{
      "noUser"   :"No user found",
      "saveUser" : "Error in saving user",
      "undefined"                :   "undefined value",
      "undefinedRole"            :   "undefined Username",
      "undefinedUsername"            :   "undefined role",
      "undefinedEmail"            :   "undefined Email",
      "undefinedPassword"            :   "undefined Password",
      "undefinedFirstName"            :   "undefined undefinedFirstName",
      "undefinedEntererId"       :   "undefined Enterer Id",
      "undefinedUpdateUser"      :   "undefined Update  User Id",
      "saveRole"      :   "Error in saving Role",
      "undefinedRole"      :   "Role is not defined",
        "fetchRoles"                 :   "Error in fetch Roles",
        "deleteRole"                 :   "Error in delete Roles",
        "udpateRole"                 :   "Error in udpate Roles",
        "login"                 :   "Login Failure",
        "changePassword"                 :   "Error in change Password",
        "changePasswordFailed"                 :   "Password malfunction",
        "forgetPasswordFailed"                 :   "forget Password Failed",
        "emailVerifiedError"                 :   "email Verified Error",
    },
    success:{
      "saveUser"                 : "Success in saving user",
      "undefined"                :   "undefined value",
      "undefinedRole"            :   "undefined role",
      "undefinedEntererId"       :   "undefined Enterer Id",
      "undefinedUpdateUser"      :   "undefined Update  User Id",
      "saveRole"                 :   "Success in saving Role",
      "fetchRoles"                 :   "Success in fetch Roles",
      "deleteRole"                 :   "Success in delete Roles",
      "udpateRole"                 :   "Success in udpate Roles",
      "login"                 :   "Login Success",
      "changePassword"                 :   "Success in change Password",
      "emailVerifiedSuccess"                 :   "email Verified Success",
      "verificationMailSent"                 :   "verification Mail Sent",
      "passwordReset"                 :   "Password reset succfully",

    },

  },
  gmailSMTPCredentials : {
      "service"           : "gmail",
      "host"              : "smtp.gmail.com",
      "username"          : "goappsolutions",
      "mailUsername"          : "GOApps",
      "password"          : "Asdf!234",
      "verificationMail"  : "goappsolutions@gmail.com"
  },
  mailFormat : {
      "forgotPassword" : {
        "header" : "Forgot Password",
        "content" : "Hello Mr. {{name}} ,\n \t\t please click on the follwing link to reset your password . \n\n {{link}}",
        "link" : config[config["env"]].baseUrl+"/forgotPassword/{{passwordToken}}",
      }
  }

}
module.exports = constants;