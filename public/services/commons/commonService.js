app.factory("CommonService", ["$http","$resource", function($http,$resource) {
  var jobs = [];

  // var CommonOperation = function() {
    return $resource('/',null, {
        signIn: {
            method: 'POST',
            url:"/user/signIn",
            headers:"application/json"
        },
    });
  // }
  // return {
  //     CommonOperation:CommonOperation
  // }
}])
