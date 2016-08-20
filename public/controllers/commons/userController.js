app.controller("UserController", function($scope,$rootScope,CommonService,$state,Constants,$localStorage,UserService,Util) {
  $scope.currentTab = 'myprofile';
  /*******************************************************/
  /*************This is use for change the tab************/
  /*******************************************************/
  $scope.changeTab = function(tab){
    $scope.currentTab = tab;
  }
  /*******************************************************/
  /********This is use for load the loged in profile******/
  /*******************************************************/
  $scope.$watch($rootScope.logedInUser,function(){
    $scope.userProfile = angular.copy($rootScope.logedInUser);
    console.log($scope.userProfile);
  })
  /*******************************************************/
  /********This is use for update the profile details*****/
  /*******************************************************/
  $scope.updateMyProfile = function(){
    var obj = {
      "firstName": $scope.userProfile.firstName,
      "lastName": $scope.userProfile.lastName,
      "middleName": $scope.userProfile.middleName,
      "email": $scope.userProfile.email
    }
    UserService.updateUser(obj,function(response){
      $localStorage[Constants.getTokenKey()] = response.data.token;
      $rootScope.logedInUser = response.data.user;
      Util.alertMessage('success', response.message);
    });

  }
  /*******************************************************/
  /**************This is use for change password**********/
  /*******************************************************/
  $scope.changePassword = function(){
    var obj = {
      "oldPassword": $scope.password.current,
      "newPassword": $scope.password.confirm
    }
    UserService.changePassword(obj,function(response){
      console.log(response);
      Util.alertMessage('success', response.message);
    });
  }
})
