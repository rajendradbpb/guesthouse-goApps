app.controller("UserController", function($scope,$rootScope,CommonService,$state,Constants,$localStorage) {
  $scope.changeTab = function(tab){
    $scope.currentTab = tab;
  }
})
