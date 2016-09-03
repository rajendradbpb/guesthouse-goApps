app.controller("transactionController", function($scope,$rootScope,UserService,$state,GuesthouseService,$stateParams,Util,UtilityService,transactionService) {
  $scope.currentTab = 'roomlists';
  console.log($scope.roomFeature);
  $scope.transactionTab = function(tab){
    $scope.currentTab = tab;
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
  $scope.bookRoom = function(_id){
    $scope.selectedRooms = [];
    $scope.selectedRoomsPrice = 0;
    angular.forEach($scope.room_list,function(room,key) {
      if(room.isChecked){
        $scope.selectedRooms.push(room);
        $scope.selectedRoomsPrice+=room.price;
      }
    });
    $scope.initCheckIn();
    $scope.currentTab = 'checkIn';
  }
  $scope.initCheckIn = function() {
    // get the selected rooms No
    $scope.selectedRoomsNo = UtilityService.getSelectedItemByProp($scope.selectedRooms,"isChecked",true,"roomNo");
    $scope.selectedRoomID = UtilityService.getSelectedItemByID($scope.selectedRooms,"isChecked",true,"_id");
    console.log($scope.selectedRoomID);
  }
  $scope.submitNewBooking = function(){
    var obj ={
      "otp":$scope.transaction.otp,
      "cName":$scope.transaction.cName,
      "cMobile":$scope.transaction.cMobile,
      "address":$scope.transaction.address,
      "rooms" :$scope.selectedRoomID,
      "price" :$scope.selectedRoomsPrice,
      "tranctionNo":$scope.transaction.transactionNo
    }
    console.log(obj);
    transactionService.addTransaction(obj,function(response){
       //console.log($scope.transaction);
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
          // refresh the room list and change the tab to the room list
          $scope.getRoom();
          $scope.currentTab = 'roomlists';
      }
      // else {
      //     Util.alertMessage('danger', response.message);
      // }
    })
  };
   /**
    * $scope.changeTransactionTab
    * This will caleed from the transaction listing page
    * input : this takes as string for the trasaction numner , Customer name , mobile No etc
    * output : list of the trasaction
    * createdDate - 4-9- 2016
    * updated on -  4-9- 2016
    */

   $scope.$watch('currentTab',function(value) {
     if(value == "transaction"){
       // call the service to get the trasactions
       transactionService.getTransaction(function(response) {
         $scope.trasactionList = response.data
       },
       function(err){
         Util.alertMessage('error', err.message);
       }
     )
     }
   })
   /**
    * $scope.serchTransaction
    * This will caleed from the transaction listing page
    * input : this takes as string for the trasaction numner , Customer name , mobile No etc
    * output : list of the trasaction
    * createdDate - 4-9- 2016
    * updated on -  4-9- 2016
    */
   $scope.serchTransaction = function(searchStr) {
     // call the service to get the trasactions
     var obj = {
       searchStr:searchStr
     }
     transactionService.getTransaction(obj,function(response) {
       $scope.trasactionList = response.data
     },
       function(err){
         Util.alertMessage('error', err.message);
       }
     )
   }
})
