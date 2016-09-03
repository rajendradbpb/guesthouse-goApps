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
      Util.alertMessage('success', response.message);
    });
  }
  /*******************************************************/
  /**************This is use for getting all role type in asign role dropdown**********/
  /*******************************************************/
  $scope.getRoleType = function(){
    UserService.getRoleType(function(response){
      $scope.roleType = response.data;
    });
  }
  /*******************************************************/
  /**************This is use for submit user details**********/
  /*******************************************************/
  $scope.submitUserDetails = function(){
    var obj={
      "firstName"  : $scope.user.first_name,
      "middleName" : $scope.user.middle_name,
      "lastName"   : $scope.user.last_name,
      "email"      : $scope.user.email,
      "role"       : $scope.user.user_role,
      "userName"   : $scope.user.user_name,
      "password"   : $scope.user.password,
      "minPrice"   : $scope.user.minprice,
      "maxPrice"   : $scope.user.maxprice,
      "mobile"     : $scope.user.mobile,
      "establishDate" :moment($scope.user.date).format("YYYY-MM-DD")
    }
    if($scope.user.guestHouseName)
      obj["guestHouseName"] = $scope.user.guestHouseName;
    //console.log(obj);
    UserService.submitUserDetails(obj,function(response){
      console.log(response);
      Util.alertMessage('success', response.message);
    });
  }
  $scope.open2 = function() {
   $scope.popup2.opened = true;
  };
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];
  $scope.popup2 = {
    opened: false
  };
  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }
    return '';
  }
})
