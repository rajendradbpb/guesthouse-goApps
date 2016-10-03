app.controller("SignInController",["$scope","$rootScope","CommonService","$state","Constants","$localStorage",function($scope,$rootScope,CommonService,$state,Constants,$localStorage) {
  $scope.user = {};
  $scope.signIn = function(user){
    $rootScope.showPreloader = true;
    CommonService.signIn(user,function(pres) {
    $rootScope.showPreloader = false;
      // saving the token if exists
      // $localStorage[Constants.storagePrefix+"$token"] =
      if(pres.data.token){
        //saving token in the local storage
        $localStorage[Constants.getTokenKey()] = pres.data.token;
        $localStorage[Constants.getLoggedIn()] = true;
        $rootScope.loggedin = $localStorage[Constants.getLoggedIn()];
        switch (pres.data.role) {
          case "ccare":
          $state.go("ccare-dashboard");
          break;
          case "admin":
          $state.go("admin-dashboard");
          break;
          case "ghUser":
          $state.go("guest_house-dashboard");
          break;
          case "ghAdmin":
          break;
          default:
        }
      }
      else{
        $state.go(signIn);
          // Util.alertMessage('danger', pRes.data.message);
      }
    },
    function(err) {
      console.log("err",err);

    }

    )
  }
}])
