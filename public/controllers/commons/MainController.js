app.controller("MainController",function($scope,$rootScope,$localStorage,Constants,$state) {
  console.log("main controller");
  $rootScope.loggedin = $localStorage[Constants.getLoggedIn()];
  $scope.signOut = function() {
    $rootScope.loggedin = $localStorage[Constants.getLoggedIn()] = false;
    $state.go("signIn");
  }
})
