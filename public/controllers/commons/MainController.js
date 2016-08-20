app.controller("MainController",function($scope,$rootScope,$localStorage,Constants,$state,UserService) {
  console.log($rootScope.logedInUser);
  $rootScope.loggedin = $localStorage[Constants.getLoggedIn()];
  $scope.signOut = function() {
    $rootScope.loggedin = false;
    delete $localStorage[Constants.getTokenKey()]
    $state.go("signIn");
  }
})
