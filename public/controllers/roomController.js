app.controller("roomController", function($scope,$rootScope,UserService,$state,GuesthouseService,$stateParams,Util,UtilityService,transactionService,$timeout,Events,$localStorage) {
  $scope.filterType = 1;
  $scope.minDate = new Date();
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  $scope.$state = $state;
  $scope.roomListInit = function() {
    $scope.countChecked(); // this is used to update the Go to Booking button in the room list init
  }
  /*******************************************************/
  /*******This code is used to get all the room lists*****/
  /*******************************************************/
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
  $scope.goToRoomDetails = function(room){
    localStorage.setItem('room_id', room._id);
    $state.go('room_Details');
  }
  $scope.getRoomDetails = function(){
    var obj = {
      "_id":localStorage.getItem('room_id')
    }
    GuesthouseService.getRoom(obj,function(response){
        $scope.room = response.data[0];
       angular.forEach($scope.facilities,function(item){
          item.isChecked = false;
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
  $scope.goToBookRoom = function(room){
    localStorage.setItem('room_id', room._id);
    $state.go('BookingDetails');
  }
  $scope.bookRoom = function(_id){
    console.log(_id);
    $scope.selectedRooms = [];
    $scope.selectedRoomsPrice = 0;
    angular.forEach($scope.room_list.availableRooms,function(room,key) {
      if(room.isChecked){
        $scope.selectedRooms.push(room);
        $scope.selectedRoomsPrice+=room.price;
      }
    });
    $scope.initCheckIn();

  }
  /**
   * functionName : initCheckIn
   * Info : codes to get room id of selected rooms
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.initCheckIn = function() {
    // get the selected rooms No
    $scope.selectedRoomsNo = UtilityService.getSelectedItemByProp($scope.selectedRooms,"isChecked",true,"roomNo");
    $scope.selectedRoomID = UtilityService.getSelectedItemByID($scope.selectedRooms,"isChecked",true,"_id");
  }
  /**
   * functionName : submitNewBooking
   * Info : codes for submitting new booking/transaction details
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
    /**
     * functionName :   $scope.showreportList
     * Info : dependencies codes for Transaction report
     * input : ...
     * output :...
     * createdDate -21-9-2016
     * updated on -  21-9-2016 // reason for update
     */
    $scope.booking_disable = true;
    $scope.countChecked = function(){
    var count = 0;
    if($scope.room_list && $scope.room_list.availableRooms.length){
      angular.forEach($scope.room_list.availableRooms, function(value){
        if (value.isChecked) count++;
      });
      $scope.booking_disable = (count > 0) ? false : true;
    }
  }
  /**
   * functionName :     $scope.countSelect
   * Info :codes for enableing gotocheckout button
   * input : ...
   * output :...
   * createdDate -23-9-2016
   * updated on -  23-9-2016 // reason for update
   */
    $scope.countSelect = function(){
    var count = 0;
    angular.forEach($scope.selectedTransaction.roomsDetails, function(value){
        if (value.isSelect) count++;
    });
    return count;
  }

})
