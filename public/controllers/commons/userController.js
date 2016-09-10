app.controller("UserController", function($scope,$rootScope,CommonService,$state,Constants,$localStorage,UserService,Util) {
  $scope.currentTab = 'myprofile';
  $scope.user = {};
  $scope.user.establishDate = "11-02-2016";
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
    $rootScope.showPreloader = true;
    UserService.updateUser(obj,function(response){
    $rootScope.showPreloader = false;
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
    $rootScope.showPreloader = true;
    UserService.changePassword(obj,function(response){
    $rootScope.showPreloader = false;
      Util.alertMessage('success', response.message);
    });
  }
  /*******************************************************/
  /**************This is use for getting all role type in asign role dropdown**********/
  /*******************************************************/
  $scope.getRoleType = function(){
    $rootScope.showPreloader = true;
    if($scope.roleType && $scope.roleType.length > 0)
    return;
    UserService.getRoleType(function(response){
    $rootScope.showPreloader = false;
      console.log(response);
      $scope.roleType = response.data;
       // to udpate the user role on init roles
      $scope.selectedRole = $scope.roleType[0];
      $scope.onSelectRole();
    });
  }
  /*******************************************************/
  /**************This is use for submit user details**********/
  /*******************************************************/
  $scope.submitUserDetails = function(){
      $rootScope.showPreloader = true;
    UserService.submitUserDetails($scope.user,function(response){
      $rootScope.showPreloader = false;
      Util.alertMessage('success', response.message);
    });
  }
  /**
   * functionName :onSelectRole
   * Info : to udpate the user role id
   *
   * createdDate - 8-9-16
   * updated on -  8-9-16 // reason for update
   */
   $scope.onSelectRole = function(){
     $scope.user.role = $scope.selectedRole._id;
   }
})
