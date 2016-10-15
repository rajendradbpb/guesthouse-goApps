app.controller("SignInController",["$scope","$rootScope","CommonService","$state","Constants","$localStorage","Util","$timeout","UtilityService",function($scope,$rootScope,CommonService,$state,Constants,$localStorage,Util,$timeout,UtilityService) {
  $scope.user = {};
  $scope.alert = null;
  $scope.initSignIn = function(index) {

    if($localStorage[Constants.getIsRemember()]){
      $scope.user.username = $localStorage[Constants.getUsername()];
      $scope.user.password = UtilityService.decode($localStorage[Constants.getPassword()]);
      $scope.user.remember = $localStorage[Constants.getIsRemember()];
    }
  };
  $scope.closeAlert = function(index) {
    $timeout(function() {
      $scope.alert = null;
    },Constants.alertTime)
  };
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

        // saving / removing remember me data
        if(user.remember){
          $localStorage[Constants.getUsername()] = user.username;
          $localStorage[Constants.getPassword()] = UtilityService.encode(user.password);
          $localStorage[Constants.getIsRemember()] = true;
        }
        else{
          delete $localStorage[Constants.getUsername()];
          delete $localStorage[Constants.getPassword()];
          delete $localStorage[Constants.getIsRemember()];
        }
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
      $scope.alert = {type:"danger",msg:err.data == "Unauthorized" ? Constants.invalidCredentials : err.data}
      $scope.closeAlert();
    }

    )
  }

}])
