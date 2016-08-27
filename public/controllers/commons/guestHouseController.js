app.controller("GuesthouseController", function($scope,$rootScope,UserService,$state,$stateParams,Util,UtilityService,GuesthouseService) {
  $scope.currentTab = 'roomlists';
  $scope.roomFeature = [
    "Single bed",
    "Double bed",
    "AC",
    "NON AC"
  ];
  $scope.roomlistingTab = function(tab){
    $scope.currentTab = tab;
  }

  // $scope.getuser = function(){
  //   GuesthouseService.getuser(function(response){
  //     console.log(response);
  //     //$scope.user_list = response.data;
  //   });
  // }
  $scope.submitguestHouse = function(){
    // var obj={
    //   "user":$scope.ghUser.username,
    //   "name":$scope.ghUser.name,
    //   "mobile":$scope.ghUser.mobile,
    //   "phone":$scope.ghUser.phone,
    //   "minPrice":$scope.ghUser.minprice,
    //   "maxPrice":$scope.ghUser.maxprice,
    //   "establishDate":$scope.ghuser.date
    // }
    // console.log(obj);
    GuesthouseService.submitguestHouse($scope.ghUser,function(response){
      console.log(response);
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
      }
      else {
          Util.alertMessage('danger', response.message);
      }
    })
  }

  $scope.newRoomInit = function() {
    GuesthouseService.getFacilities(
      function(response){
          console.log(response);
          if(response.statusCode == 200){
              // Util.alertMessage('success', response.message);
              $scope.facilities = response.data;
          }
          else {
              Util.alertMessage('danger', response.message);
          }
      },
      function(err){
            Util.alertMessage('danger', err.message);
      }
    )
  }
  $scope.addRoom = function(form) {
    console.log($scope.facilities);
    // get the selected facility ids
    $scope.room.facility = UtilityService.getSelectedIds($scope.facilities,"isChecked",true);
    //
    GuesthouseService.addRoom(
      $scope.room,
      function(response){
          console.log(response);
          if(response.statusCode == 200){
              // Util.alertMessage('success', response.message);
              $scope.facilities = response.data;
          }
          else {
              Util.alertMessage('danger', response.message);
          }
      },
      function(err){
            Util.alertMessage('danger', err.message);
      }
    )
  }

})
