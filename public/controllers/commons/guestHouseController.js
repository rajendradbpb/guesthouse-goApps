app.controller("GuesthouseController", function($scope,$rootScope,UserService,$state,$stateParams,Util,UtilityService,GuesthouseService) {
  $scope.currentTab = 'roomlists';
  $scope.roomFeature = [
    {"name":"Single bed","value":'SINGLE-BED'},
    {"name":"Double bed","value":'DOUBLE-BED'},
    {"name":"AC","value":'AC'},
    {"name":"NON AC","value":'NON-AC'}
  ];
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
    GuesthouseService.getFacilities(
      function(response){
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
    GuesthouseService.addRoom($scope.room, function(response){
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
  $scope.getRoom = function(_id,searchType){
    var obj = {};
    if(_id)
      obj._id = _id;
    GuesthouseService.getRoom(obj,function(response){
      if(searchType == "details"){
        $scope.currentTab = 'roomdetails';
        $scope.room = response.data[0];
        angular.forEach($scope.facilities,function(item){
           item.isChecked = false;
          if($scope.room.facility.length > 0){
            angular.forEach($scope.room.facility,function(facility){
              if(facility._id == item._id){
                 item.isChecked = true;
              }
            })
          }
        });
      }
      else {
        // this is for listing
        $scope.room_list = response.data;
      }
    })
  }
  /*******************************************************/
  /********This code is to update room details******/
  /*******************************************************/
  $scope.updateRoomDetails = function(){
    $scope.room.facility = UtilityService.getSelectedIds($scope.facilities,"isChecked",true);
    GuesthouseService.updateroomByID($scope.room,function(response){
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
      }
      else {
          Util.alertMessage('danger', response.message);
      }
    })
  }
  /*******************************************************/
  /********This code is to delete room details******/
  /*******************************************************/
  $scope.deleteRoom = function(id){
    console.log(id);
      var obj = {
       "_id":id
      }
      GuesthouseService.deleteRoom(obj,function(response) {
        if(response.statusCode == 200){
            $scope.getRoom();
        }
     })
    }

})
