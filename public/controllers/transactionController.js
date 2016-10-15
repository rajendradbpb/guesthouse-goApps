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
  $scope.roomListInit = function() {
    $scope.countChecked(); // this is used to update the Go to Booking button in the room list init
  }
  /*******************************************************/
  /*******This code is used to get all the room lists*****/
  /*******************************************************/
  $scope.getRoom = function(){
    $rootScope.showPreloader = true;
    var obj = {
       "checkInDate" : moment().format("MM-DD-YYYY")
    };
    GuesthouseService.getRoom(obj,function(response){
      $rootScope.showPreloader = false;
      $scope.room_list = response.data;
      console.log($scope.room_list);
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
  $scope.bookRoom = function(_id){
    $scope.selectedRooms = [];
    $scope.selectedRoomsPrice = 0;
    angular.forEach($scope.room_list.availableRooms,function(room,key) {
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
      "checkInDate" : moment($scope.transaction.checkInDate).format("MM-DD-YYYY"),
      "checkOutDate" : moment($scope.transaction.checkOutDate).format("MM-DD-YYYY"),
      "bookingStatus" : $scope.transaction.status,
      "guestHouse" : $rootScope.logedInUser._id
    }
    console.log("before save  ",JSON.stringify(obj));
    transactionService.addTransaction(obj,function(response){
    $rootScope.showPreloader = false;
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
          // refresh the room list and change the tab to the room list
          $timeout(function() {
            $scope.getRoom();
            $scope.currentTab = 'roomlists';
            $scope.transaction = {};
            UtilityService.resetForm(bookroom);
          },2000)
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
         $scope.transactionList = response.data;
         angular.forEach($scope.transactionList,function(transction){
           transction.transction_price = 0;
           angular.forEach(transction.roomsDetails,function(room){
            transction.transction_price += room.price;
           });
         });
       },
       function(err){
         Util.alertMessage('error', err.message);
       }
     )
     }
    //  else if(value == "checkOut"){
    //    // assign  the checkin date with the check out date , user may change that
    //    $scope.selectedTransaction.checkOutDate = new date();
    //  }
     else if(value == "roomlists"){
       // update the filter type = 1
       $scope.filterType = 1;
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
       room.checkInDate = moment(room.checkInDate).format('YYYY-MM-DD');
       room.checkOutDate = moment().format('YYYY-MM-DD');
       console.log(room.checkOutDate);
       if(moment($scope.selectedTransaction.roomsDetails[0].checkOutDate).isBefore($scope.selectedTransaction.roomsDetails[0].checkInDate, 'days')){
         $scope.selectedTransaction.roomsDetails[0].checkOutDate = null;
       }
       else {
         var from = moment(room.checkInDate);
         var to = moment(room.checkOutDate);
         var different = to.diff(from,'days');
         console.log(different);
         if(different == 0){
           room.totalPrice = room.price * 1;
         }
         else {
           room.totalPrice = room.price * different;
         }
        //  $scope.tempTotPrice = $scope.selectedTransaction.totalPrice;
       }
     });
     $scope.transactionTab('transactionDetails');
    //  $scope.ReportListTab('Transactiondetails');
   }
   /**
    * functionName : calculateDiscount
    * Info : used to make the room AVAILABLE and update the price as per the selected checkInDate and the checkOutDate and the payment
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.calculateDiscount = function(){
     if($scope.selectedTransaction.totalPrice < $scope.tempTotPrice){
       $scope.selectedTransaction.discount = $scope.tempTotPrice - $scope.selectedTransaction.totalPrice;
     }
     else {
       if($scope.selectedTransaction.totalPrice >= $scope.tempTotPrice){
         $scope.selectedTransaction.discount = 0;
       }
     }
   }
   /**
    * functionName : gotoCheckOut
    * Info : used to make the room AVAILABLE and update the price as per the selected checkInDate and the checkOutDate and the payment
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.gotoCheckOut = function(operation){
     $scope.operationType = operation;
     $scope.roomPrice = 0;
     $scope.selectedTransaction.totalPrice = 0;
     $scope.selectedTransaction.discount = 0;
     $scope.transactionTab('checkOut');
     angular.forEach($scope.selectedTransaction.roomsDetails,function(room){
       if(room.isSelect){
         $scope.roomPrice += room.price;
         $scope.selectedTransaction.totalPrice += room.totalPrice;
       }
     })
     $scope.tempTotPrice = $scope.selectedTransaction.totalPrice;
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
     var obj = {
       "_id": $scope.selectedTransaction._id,
       "price": $scope.operationType == "checkOut" ? parseFloat($scope.selectedTransaction.totalPrice):0,
       "discount":$scope.operationType == "checkOut" ? $scope.selectedTransaction.discount:0,
       "type":$scope.operationType,
       "rooms":[]
     }
     angular.forEach($scope.selectedTransaction.roomsDetails,function(item){
       if(item.isSelect){
         obj.rooms.push(item.room._id);
       }
     })
     transactionService.updateTransaction(obj,function(response) {
        $scope.getRoom(); // refresh the rooms
        $scope.transactionTab('roomlists');
     },
     function(err){
       Util.alertMessage('error', err.message);
     });
   }
   /**
    * functionName : checkin_booked
    * Info : used to make the room checkedIn if the room is booked
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.checkin_booked = function(){
     var obj={
       "_id":$scope.selectedTransaction._id,
       "type" :"checkedIn"
     }
     transactionService.updateTransaction(obj,function(response) {
         $scope.getRoom(); // refresh the rooms
         $scope.transactionTab('roomlists');
     })
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
    $scope.showreportList = function(){
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
          $scope.reportsList = response.data;
        })
      }
    }
    $scope.showReportDetails = function(reports){
      $scope.reportDetails = reports;
      $scope.ReportListTab('viewReport');
    }
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

    // $scope.$watch("transaction.checkOutDate",function(){
    //   if($scope.transaction.checkOutDate < $scope.transaction.checkInDate ){
    //     alert('checkoutdate must be >= checkindate');
    //   }
    // })
})
