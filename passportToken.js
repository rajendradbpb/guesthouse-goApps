module.exports = function(passport) {

    // var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use('signup', new LocalStrategy(
      {
        passReqToCallback : true
      },
      function(req, username, password, done) {
        console.log("user name  ",username, password);

      }
      )
    );

}
