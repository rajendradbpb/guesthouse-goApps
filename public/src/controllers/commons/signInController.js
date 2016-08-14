app.controller("SignInController",["$scope","CommonService","$state","Constants","$localStorage",function($scope,CommonService,$state,Constants,$localStorage) {
  $scope.user = {};
  $scope.signIn = function(user){
    CommonService.signIn(user,function(pres) {
      // saving the token if exists
      // $localStorage[Constants.storagePrefix+"$token"] =
      if(pres.data.token){
        //saving token in the local storage
        $localStorage[Constants.getTokenKey()] = pres.data.token;
        switch (pres.data.role) {
          case "ccare":
          $state.go("ccare.dashboard");
          break;
          case "admin":

          break;
          case "ghUser":

          break;
          case "ghAdmin":

          break;
          default:

        }

      }
      else {
        // clear existing token
        $state.go("signIn");
      }
    },
    function(err) {
      console.log("err",err);

    }

    )
  }
}])
