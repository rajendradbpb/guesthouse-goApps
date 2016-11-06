app.controller("BookingController", function($scope,$rootScope,UserService,$state,GuesthouseService,$stateParams,Util,UtilityService,transactionService,$timeout,Events,$localStorage) {
  $scope.minDate = new Date();
  /**
   * functionName : bookRoom
   * Info : codes for get selected room details
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.bookRoom = function(){
    $scope.selectedRooms =  UtilityService.getSelectedRoom();
    console.log($scope.selectedRooms);
    $scope.initCheckIn();
  }
  /**
   * functionName : submitNewBooking
   * Info : codes for submitting new booking/transaction details
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.submitNewBooking = function(bookroom){
    $rootScope.showPreloader = true;
    var obj ={
      "otp":$scope.transaction.otp,
      "cName":$scope.transaction.cName,
      "cMobile":$scope.transaction.cMobile,
      "address":$scope.transaction.address,
      "rooms" :$scope.selectedRoomID,
      // "price" :$scope.selectedRoomsPrice,
      "transactionNo":$scope.transaction.transactionNo,
      "idproofno" :$scope.transaction.idproofno,
      "identity" : $scope.transaction.identity,
      "purpose"    : $scope.transaction.purpose,
      "checkInDate" : moment().format("MM-DD-YYYY"),
      "checkOutDate" : moment($scope.transaction.checkOutDate).format("MM-DD-YYYY"),
      "bookingStatus" : $scope.transaction.status,
      "guestHouse" : $rootScope.logedInUser._id
    }
    console.log("before save  ",JSON.stringify(obj));
    transactionService.addTransaction(obj,function(response){
    $rootScope.showPreloader = false;
    if(response.statusCode == 200){
      obj = {
        "type":"success",
        "message":response.message
      }
       $scope.$emit(Events.ALERT_MESSAGE,obj);
       $timeout(function() {
        //  $scope.getRoom();
        //  $state.go('room_lists');
         $scope.transaction = {};
         UtilityService.resetForm(bookroom);
         $state.go('room_lists');
       },2000)
    }
    else {
      obj = {
        "type":"danger",
        "message":response.message
      }
       $scope.$emit(Events.ALERT_MESSAGE,obj);
    }
    })
  };
  /**
   * functionName : initCheckIn
   * Info : codes to get room id of selected rooms
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.initCheckIn = function() {
    $scope.selectedRoomsNo = UtilityService.getSelectedItemByProp($scope.selectedRooms,"isChecked",true,"roomNo");
    $scope.selectedRoomID = UtilityService.getSelectedItemByID($scope.selectedRooms,"isChecked",true,"_id");
  }
  /**
   * functionName : changeStatus
   * Info : codes to call function when status selected from dropdown list
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.changeStatus = function(){
    $scope.transaction.checkInDate = ($scope.transaction.status == 'CHECKED-IN') ? moment().format("YYYY-MM-DD") :'';
  }

})
