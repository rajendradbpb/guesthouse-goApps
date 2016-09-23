app.controller("transactionController", function($scope,$rootScope,UserService,$state,GuesthouseService,$stateParams,Util,UtilityService,transactionService,$timeout) {
  $scope.currentTab = 'roomlists';
  $scope.filterType = 1;
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  $scope.transactionTab = function(tab){
    $scope.currentTab = tab;
  }
   $scope.currentTab1 = 'ReportList';
  $scope.ReportListTab = function(tab){
    $scope.currentTab1 = tab;
  }
  /*******************************************************/
  /********This code is used to get all the room lists******/
  /*******************************************************/
  $scope.getRoom = function(_id,searchType,Status){
    $rootScope.showPreloader = true;
    var obj = {};
    if(_id)
      obj._id = _id;
    GuesthouseService.getRoom(obj,function(response){
    $rootScope.showPreloader = false;
      //console.log(response);
      if(searchType == "details" && Status == "AVAILABLE"){
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
        console.log($scope.room_list);
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
    console.log($scope.selectedRoomID);
  }
  /**
   * functionName : submitNewBooking
   * Info : codes for submitting new booking/transaction details
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.submitNewBooking = function(){
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
      "checkInDate" : $scope.transaction.checkInDate,
      "bookingStatus" : $scope.transaction.status
    }
    console.log(obj);
    transactionService.addTransaction(obj,function(response){
    $rootScope.showPreloader = false;
       //console.log($scope.transaction);
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
          // refresh the room list and change the tab to the room list
          $scope.getRoom();
          $scope.currentTab = 'roomlists';
      }
      else {
          Util.alertMessage('danger', response.message);
      }
    })
  };
   /**
    * $scope.$watch('currentTab')
    * This will caleed from the transaction listing page
    * input : this takes as string for the trasaction numner , Customer name , mobile No etc
    * output : list of the trasaction
    * createdDate - 4-9- 2016
    * updated on -  4-9- 2016
    */

   $scope.$watch('currentTab',function(value) {
     if(value == "transaction"){
       $scope.filterType = 2;
       // call the service to get the trasactions
       transactionService.getTransaction(function(response) {
         $scope.trasactionList = response.data
       },
       function(err){
         Util.alertMessage('error', err.message);
       }
     )
     }
     else if(value == "checkOut"){
       // assign  the checkin date with the check out date , user may change that
       $scope.selectedTransaction.checkOutDate = $scope.selectedTransaction.checkInDate;
     }
     else if(value == "roomlists"){
       // update the filter type = 1
       $scope.filterType = 1;
     }
   })

   /**
    * $scope.$watch('selectedTransaction.checkOutDate')
    * This is used to udpate the price of the transaction based on the checkInDate and the checkOutDate
    *
    * createdDate - 4-9- 2016
    * updated on -  4-9- 2016
    */

   $scope.$watch('selectedTransaction.checkOutDate',function(value) {
     if(!$scope.selectedTransaction)
     return;
     if(moment($scope.selectedTransaction.checkOutDate) < moment($scope.selectedTransaction.checkInDate)){
       console.log("checkOutDate < checkInDate");
       $scope.selectedTransaction.checkOutDate = null;
     }
     else {
       console.log("checkOutDate > checkInDate");
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
   /**
    * functionName : onSelectTransaction
    * Info : keeps the data of the current selected transaction and show in the transaction detials
    * input : ...
    * output :...
    * createdDate - 4-9-2016
    * updated on -  4-9-2016 // reason for update
    */
   $scope.onSelectTransaction = function(transaction){
     $scope.selectedTransaction = transaction;
     console.log($scope.selectedTransaction);
     angular.forEach($scope.selectedTransaction.roomsDetails,function(room){
       room.isSelect = false;
     });

     $scope.transactionTab('transactionDetails');
     $scope.ReportListTab('Transactiondetails');
   }
   /**
    * functionName : gotoCheckOut
    * Info : used to make the room AVAILABLE and update the price as per the selected checkInDate and the checkOutDate and the payment
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.gotoCheckOut = function(){
     console.log($scope.selectedTransaction.rooms);
     $scope.transactionTab('checkOut');
   }
   /**
    * functionName : checkOut
    * Info : used to make the room AVAILABLE and update the price as per the selected checkInDate and the checkOutDate and the payment
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.checkOut = function(transaction){
     transaction.type = "checkOut"; // add the type of the transaction update operation
     transactionService.updateTransaction(transaction,function(response) {
         $scope.getRoom(); // refresh the rooms
         $scope.transactionTab('roomlists');
       },
       function(err){
         Util.alertMessage('error', err.message);
       }
     )
   }
    /**
     * functionName : $scope.newRoomInit()
     * Info : dependencies codes for the date picker
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
                Util.alertMessage('danger', response.message);
            }
        },
        function(err){
              Util.alertMessage('danger', err.message);
        }
      )
    }
    /**
     * functionName :   $scope.checkDate
     * Info : dependencies codes for Transaction report
     * input : ...
     * output :...
     * createdDate -21-9-2016
     * updated on -  21-9-2016 // reason for update
     */
    $scope.checkDate = function(){
      var obj={
        "fromDate" : $scope.transactionReport.startDate,
        "toDate" : $scope.transactionReport.endDate
      }
      if(moment($scope.transactionReport.endDate) < moment($scope.transactionReport.startDate)){
        //console.log("endDate < startDate");
        $scope.transactionReport.endDate = null;
      }
      else {
        $scope.currentTab1 = 'Reportdetails';
        //console.log("endDate > startDate");
        transactionService.getReport(obj,function(response) {
          $scope.trasactionList = response.data;
        })
      }
    }
    /**
     * functionName :   $scope.checkDate
     * Info :codes for check all rooms by checking select all checkbox
     * input : ...
     * output :...
     * createdDate -23-9-2016
     * updated on -  23-9-2016 // reason for update
     */
     $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.selectedTransaction.roomsDetails, function (room) {
            room.isSelect = $scope.selectedAll;
        });
    };
    /**
     * functionName :   $scope.changeStatus
     * Info :codes for check all rooms by checking select all checkbox
     * input : ...
     * output :...
     * createdDate -23-9-2016
     * updated on -  23-9-2016 // reason for update
     */
    $scope.changeStatus = function(){
      $scope.transaction.checkInDate = ($scope.transaction.status == 'CHECKED-IN') ? moment().format("YYYY-MM-DD") :'';
    }
})
