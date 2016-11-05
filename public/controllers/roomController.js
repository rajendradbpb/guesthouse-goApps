app.controller("roomController", function($scope,$rootScope,UserService,$state,GuesthouseService,$stateParams,Util,UtilityService,transactionService,$timeout,Events,$localStorage) {
  $scope.filterType = 1;
  $scope.minDate = new Date();
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  $scope.$state = $state;
  $scope.roomListInit = function() {
    $scope.countChecked(); // this is used to update the Go to Booking button in the room list init
  }
  /**
   * functionName : getRoom
   * Info : codes for get all rooms
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.getRoom = function(data){
    console.log($state,$stateParams);
    $rootScope.showPreloader = true;
    var obj = {};
    obj['checkInDate'] = $state.params.checkInDate || moment().format("MM-DD-YYYY");
    if($state.params.isDash)
      obj['isDash'] = $state.params.isDash;
    if($state.params.status)
      obj['status'] = $state.params.status;
    GuesthouseService.getRoom(obj,function(response){
      $rootScope.showPreloader = false;
      $scope.room_list = response.data;
   })
  }
  /**
   * functionName : goToRoomDetails
   * Info : codes for to go room details page
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.goToRoomDetails = function(room){
    localStorage.setItem('room_id', room._id);
    $state.go('room_Details');
  }
  /**
   * functionName : getRoomDetails
   * Info : This is used on page init to get roomdetails
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.getRoomDetails = function(){
    var obj = {
      "_id":localStorage.getItem('room_id')
    }
    GuesthouseService.getRoom(obj,function(response){
        $scope.room = response.data[0];
       angular.forEach($scope.facilities,function(item){
          item.isChecked = true;
         if($scope.room.facility){
           angular.forEach($scope.room.facility,function(facility){
             if(facility == item._id){
                item.isChecked = true;
             }
           })
         }
       });
     })
  }
  /**
   * functionName : goToBookingPage
   * Info : This is used to go bookinpage
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.goToBookingPage = function(){
    $state.go('BookingDetails');
    var rooms = [];
    angular.forEach($scope.room_list.availableRooms,function(room,key) {
      if(room.isChecked){
        rooms.push(room);
      }
    });
    UtilityService.setSelectedRoom(rooms);
    $state.go('BookingDetails');
  }
  /**
   * functionName : newRoomInit
   * Info : codes to get all facilities
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
    $scope.newRoomInit = function() {
      transactionService.getFacilities(
        function(response){
            if(response.statusCode == 200){
                $scope.facilities = response.data;
            }
            else {
                $scope.$emit(Events.ALERT_MESSAGE,'danger', response.message);
            }
        })
        // $scope.goToRoomDetails();
    }
})
