app.controller("GuesthouseController", function($scope,$rootScope,UserService,$state,$stateParams,Util,UtilityService,GuesthouseService,Events) {
  $scope.currentTab = 'roomlists';
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
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
    var roomfacility =$scope.room.facility;
    $rootScope.showPreloader = true;
    var obj ={
      "roomNo":$scope.room.roomNo,
      "roomType" :$scope.room.roomType,
      "price" :$scope.room.price,
      // "isOffer" :$scope.isoffer.checked,
      // "offerPrice":$scope.room.offerprice,
      "facility":roomfacility,
      "capacity ":$scope.room.capacity,
      "guestHouse" : $rootScope.logedInUser._id
    }
    if($scope.isoffer){
      obj.isOffer = true;
      obj.offerPrice = $scope.room.offerprice;
    }
    else {
      $scope.room.offerprice = null;
    }
    GuesthouseService.addRoom(obj, function(response){
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
      console.log($scope.room_list);
      $rootScope.showPreloader = false;
      $scope.room_list = response.data;

    })
  }
  $scope.getRoomDetails = function(room){
    $scope.currentTab = 'roomdetails';
    $scope.room = room;
    console.log($scope.room);
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
            $scope.$emit(Events.ROOM_DELETED);
        }
     })
    }
    $scope.checkOfferPrice = function(){
      if($scope.room.price <= $scope.room.offerPrice){
        $scope.offerError = true;
      }
      else{
        $scope.offerError = false;
      }
    }
})
