app.controller("GuesthouseController", function($scope,$rootScope,UserService,$state,$stateParams,Util,UtilityService,GuesthouseService) {
  $scope.currentTab = 'roomlists';
  $scope.roomFeature = ["AC","NON-AC","FAMILY","DELUX"];
  $scope.roomlistingTab = function(tab){
    $scope.currentTab = tab;
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
  $scope.addRoom = function() {
    console.log($scope.facilities);
    // get the selected facility ids
    $scope.room.facility = UtilityService.getSelectedIds($scope.facilities,"isChecked",true);
    //
    console.log(JSON.stringify($scope.room));
    GuesthouseService.addRoom(
      $scope.room,
      function(response){
          console.log(response);
          if(response.statusCode == 200){
               Util.alertMessage('success', response.message);
              // $scope.facilities = response.data;
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
  $scope.getRoom = function(_id,searchType){
    var obj = {};
    if(_id)
      obj._id = _id;
    GuesthouseService.getRoom(obj,function(response){
      if(searchType == "details"){
        $scope.currentTab = 'roomdetails';
        $scope.room = response.data[0];
      }
      else {
        // this is for listing
        $scope.room_list = response.data;
      }
      // angular.forEach($scope.facilities,function(item){
      //   item.is_checked = false;
      //   if(facilities.length > 0){
      //     angular.forEach($scope.room ,function(_id){
      //       if(_id == item._id){
      //         item.is_checked = true;
      //       }
      //     })
      //   }
      // });
    })
  }
})
