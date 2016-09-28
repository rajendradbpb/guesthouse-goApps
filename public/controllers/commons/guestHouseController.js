app.controller("GuesthouseController", function($scope,$rootScope,UserService,$state,$stateParams,Util,UtilityService,GuesthouseService) {
  $scope.currentTab = 'roomlists';
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  console.log($scope.roomFeature);
  $scope.roomlistingTab = function(tab){
    $scope.currentTab = tab;
  }
  //$scope.currentTab = 'roomlists';
  $scope.transactionTab = function(tab){
    $scope.currentTab = tab;
  }
  /*******************************************************/
  /********This is use for loading room facilities during page load******/
  /*******************************************************/
  $scope.newRoomInit = function() {
    $rootScope.showPreloader = true;
    GuesthouseService.getFacilities(
      function(response){
          $rootScope.showPreloader = false;
          if(response.statusCode == 200){
              $scope.facilities = response.data;
              console.log($scope.facilities);
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
  /*******************************************************/
  /********This code is for adding new room details******/
  /*******************************************************/
  $scope.addRoom = function(form) {
    $scope.room.facility = UtilityService.getSelectedIds($scope.facilities,"isChecked",true);
    $rootScope.showPreloader = true;
    GuesthouseService.addRoom($scope.room, function(response){
    $rootScope.showPreloader = false;
      console.log($scope.room);
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
      }
      else {
          Util.alertMessage('danger', response.message);
      }
    },function(err){
      Util.alertMessage('danger', err.message);
    });
  }
  /*******************************************************/
  /********This code is used to get all the room lists******/
  /*******************************************************/
  $scope.getRoom = function(){
    $rootScope.showPreloader = true;
    var obj = {
      "checkInDate" : moment().format("MM-DD-YYYY")
    };
    GuesthouseService.getRoom(obj,function(response){
      $rootScope.showPreloader = false;
      $scope.room_list = response.data;
    })
  }
  $scope.getRoomDetails = function(room){
    $scope.currentTab = 'roomdetails';
    $scope.room = room;
    angular.forEach($scope.facilities,function(item){
       item.isChecked = false;
      if($scope.room.facility.length > 0){
        angular.forEach($scope.room.facility,function(facility){
          if(facility == item._id){
             item.isChecked = true;
          }
        })
      }
    });
  }
  /*******************************************************/
  /********This code is to update room details******/
  /*******************************************************/
  $scope.updateRoomDetails = function(){
    $scope.room.facility = UtilityService.getSelectedIds($scope.facilities,"isChecked",true);
    $rootScope.showPreloader = true;
    GuesthouseService.updateroomByID($scope.room,function(response){
      $rootScope.showPreloader = false;
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
      }
      else {
          Util.alertMessage('danger', response.message);
      }
    },function(err){
      Util.alertMessage('danger', err.message);
    });
  }
  /*******************************************************/
  /********This code is to delete room details******/
  /*******************************************************/
  $scope.deleteRoom = function(id){
    console.log(id);
      var obj = {
       "_id":id
      }
      $rootScope.showPreloader = true;
      GuesthouseService.deleteRoom(obj,function(response) {
      $rootScope.showPreloader = false;
        if(response.statusCode == 200){
            $scope.getRoom();
        }
     })
    }
})
