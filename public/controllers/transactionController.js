app.controller("transactionController", function($scope,$rootScope,UserService,$state,GuesthouseService,$stateParams,Util,UtilityService,transactionService,$timeout,Events) {
  $scope.currentTab = 'roomlists';
  $scope.filterType = 1;
  $scope.minDate = new Date();
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  $scope.transactionTab = function(tab){
    $scope.isCheckout = false;
    $scope.selectedAll = false;
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
      obj = {
        "type":"success",
        "message":response.message
      }
       $scope.$emit(Events.ALERT_MESSAGE,obj);
       $timeout(function() {
         $scope.getRoom();
         $scope.currentTab = 'roomlists';
         $scope.transaction = {};
         UtilityService.resetForm(bookroom);
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
         var transactionList = response.data;
         angular.forEach(transactionList,function(transction){
           transction.roomNo = [];
           transction.price = [];
           angular.forEach(transction.roomsDetails,function(room){
             transction.roomNo.push(room.room.roomNo);
             transction.price.push(room.room.price);
           });
         });
         $timeout(function () {
            $scope.transactionList = transactionList;
            console.log($scope.transactionList);
         });
       })
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
   $scope.$watch('transaction.checkOutDate',function(value){
    // $scope.transaction.checkInDate
     var obj={
         "rooms" :$scope.selectedRoomID,
         "checkInDate":moment($scope.transaction.checkInDate).format("MM-DD-YYYY"),
         "checkOutDate":moment($scope.transaction.checkOutDate).format("MM-DD-YYYY"),
         "guestHouse":$rootScope.logedInUser._id
       }
       transactionService.checkAvailability(obj,function(response) {
         if(response.data){
           obj = {
             "type":"danger",
             "message":response.message
           }
            $scope.$emit(Events.ALERT_MESSAGE,obj);
         }
       })
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
     angular.forEach($scope.selectedTransaction.roomsDetails,function(room){
       room.isSelect = false;
       room.checkInDate = moment(room.checkInDate).format('YYYY-MM-DD');
       room.checkOutDate = moment().format('YYYY-MM-DD');
       console.log($scope.selectedTransaction);
       if(moment($scope.selectedTransaction.roomsDetails[0].checkOutDate).isBefore($scope.selectedTransaction.roomsDetails[0].checkInDate, 'days')){
         $scope.selectedTransaction.roomsDetails[0].checkOutDate = null;
       }
       else{
         var from = moment(room.checkInDate);
         var to = moment(room.checkOutDate);
         var different = to.diff(from,'days');
         $scope.different = (different == 0) ? 1 : different;
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
     if($scope.selectedTransaction.discount <= $scope.tempTotPrice){
       $scope.selectedTransaction.totalPrice = $scope.tempTotPrice - $scope.selectedTransaction.discount;
     }
     else {
       if($scope.selectedTransaction.discount > $scope.tempTotPrice){
         $scope.selectedTransaction.discount = 0;
         $scope.selectedTransaction.totalPrice = $scope.tempTotPrice;
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
    //  var savedData = {};
     $scope.operationType = operation;
     $scope.selectedRooms = [];
     $scope.selectedRoomno = [];
     $scope.roomPrice = 0;
     $scope.selectedTransaction.totalPrice = 0;
     $scope.selectedTransaction.discount = 0;

     $scope.transactionTab('checkOut');
     angular.forEach($scope.selectedTransaction.roomsDetails,function(room){
       if(room.isSelect){
         $scope.selectedRooms.push(room);
         $scope.selectedRoomno.push(room.room.roomNo);
         console.log($scope.selectedRooms);
         $scope.roomPrice += room.price;
         $scope.selectedTransaction.totalPrice += room.totalPrice;
         $scope.checkOutDate =  moment().format('YYYY-MM-DD');
       }
     })
     $scope.tempTotPrice = $scope.selectedTransaction.totalPrice;
    //  var data =$scope.selectedTransaction;

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
       "discount":$scope.operationType == "checkOut" ?  parseFloat($scope.selectedTransaction.discount):0,
       "type":$scope.operationType,
       "rooms":[]
     }
     angular.forEach($scope.selectedRooms,function(item){
       if(item.isSelect){
         obj.rooms.push(item.room._id);
       }
     });
     transactionService.updateTransaction(obj,function(response) {
        $scope.getRoom(); // refresh the rooms
        // $scope.transactionTab('roomlists');
        if(response.statusCode == 200){
          obj = {
            "type":"success",
            "message":response.message
          }
          $scope.isCheckout = true;
          $scope.$emit(Events.ALERT_MESSAGE,obj);
        }
        else {
          obj = {
            "type":"danger",
            "message":response.message
          }
           $scope.$emit(Events.ALERT_MESSAGE,obj);
        }
     })
   }
   $scope.printInvoice = function(){
     var docHead = document.head.outerHTML;
     var printContents = document.getElementById('invoice-print').outerHTML;
     var winAttr = "location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=600, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes";
     var newWin = window.open("", "_blank", winAttr);
     var writeDoc = newWin.document;
     writeDoc.open();
     writeDoc.write('<!doctype html><html>' + docHead + '<body onLoad="window.print()">' + printContents + '</body></html>');
     writeDoc.close();
     newWin.focus();
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
         if(response.statusCode == 200){
           obj = {
             "type":"success",
             "message":response.message
           }
            $scope.$emit(Events.ALERT_MESSAGE,obj);
         }
         else {
           obj = {
             "type":"danger",
             "message":response.message
           }
            $scope.$emit(Events.ALERT_MESSAGE,obj);
         }
     })
   }
    /**
     * functionName : $scope.newRoomInit()
     * Info : dependencies codes facilities
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
    }
    /**
     * functionName :   $scope.showreportList
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
          if(response.statusCode == 200){
            obj = {
              "type":"success",
              "message":response.message
            }
             $scope.$emit(Events.ALERT_MESSAGE,obj);
          }
          else {
            obj = {
              "type":"danger",
              "message":response.message
            }
             $scope.$emit(Events.ALERT_MESSAGE,obj);
          }
        })
      }
    }
    $scope.showReportDetails = function(reports){
      $scope.reportDetails = reports;
      $scope.ReportListTab('viewReport');
    }
    /***** this is used in the transactionDetails page in the room list table******/
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
  /**
   * Event listners goes here
   */
   $rootScope.$on(Events.ROOM_LIST,function(event,data) {
     obj = {
       "checkInDate" : data.checkInDate || moment().format("MM-DD-YYYY"),
       "isDash"      : data.isDash,
       "status"        : data.status
     };
     $rootScope.dashBoardData = obj; // this will used to call get Room again if event called from dashBoard
     $state.go("transaction_details",obj);
   })
  //  $scope.$on('$viewContentLoaded', function(event){
  //    if($rootScope.dashBoardData){
  //      $scope.getRoom($rootScope.dashBoardData);
  //      $rootScope.dashBoardData = null;
  //    }
  //  });
  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;
})
