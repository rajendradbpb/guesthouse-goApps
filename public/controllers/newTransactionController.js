app.controller("newTransactionController", function($scope,$rootScope,UserService,$state,GuesthouseService,$stateParams,Util,UtilityService,transactionService,$timeout,Events) {
  $scope.currentTab = 'roomlists';
  $scope.filterType = 1;
  $scope.minDate = new Date();
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  $scope.$state = $state;
  $scope.isCheckout = false;
  $scope.checkOutRoom = function(){
    var obj = {
      "_id": $scope.selectedTransaction._id,
      "price": $scope.selectedTransaction.totalPrice,
      "discount":$scope.selectedTransaction.discount,
      "type":"checkOut",
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
  /**
   * functionName : serchTransaction
   * Info : code used for search transaction on transaction page
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
   $scope.serchTransaction = function(searchStr) {
     // call the service to get the trasactions
     var obj = {
       searchStr:searchStr
     }
     transactionService.getTransaction(obj,function(response) {
       $scope.transactionList = response.data;
     },
       function(err){
         Util.alertMessage('error', err.message);
       }
     )
   }
   /**
    * functionName : getAllTransaction
    * Info : code used to get all transaction on page init
    * input : ...
    * output :...
    * createdDate - 4-9-2016
    * updated on -  4-9-2016 // reason for update
    */
   $scope.getAllTransaction = function(){
     $scope.filterType = 2;
     // call the service to get the trasactions
     transactionService.getTransaction(function(response) {
      $scope.transactionList = response.data;
     })
     }
     /**
      * functionName : getRoom
      * Info : code used to get all rooms
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
         room.different = $scope.different;
         if(different == 0){
           room.totalPrice = room.price * 1;
         }
         else {
           room.totalPrice = room.price * different;
         }
        //  $scope.tempTotPrice = $scope.selectedTransaction.totalPrice;
       }
     });
     UtilityService.setTransaction(transaction);
     $state.go('transactionDetails');
   }
   /**
    * functionName : getTransactionData
    * Info : used to get all transaction data on transactionpage
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.getTransactionData = function(transaction){
     $scope.selectedTransaction = UtilityService.getTransaction();
     if(!$scope.selectedTransaction)
        $state.go("allTransactions");
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
    UtilityService.setTransaction($scope.selectedTransaction);
     $state.go('checkout');
   }
   /**
    * functionName : loadCheckoutDetails()
    * Info : code used to get checkoutdetails on page init call
    * input : ...
    * output :...
    * createdDate - 4-9-2016
    * updated on -  4-9-2016 // reason for update
    */
   $scope.loadCheckoutDetails = function(){
     $scope.selectedTransaction = UtilityService.getTransaction();
     $scope.selectedRooms = [];
     $scope.selectedRoomno = [];
     $scope.roomPrice = 0;
     $scope.selectedTransaction.totalPrice = 0;
     $scope.selectedTransaction.discount = 0;
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
    * functionName : countSelect()
    * Info : code used to get checkoutdetails on page init call
    * input : ...
    * output :...
    * createdDate - 4-9-2016
    * updated on -  4-9-2016 // reason for update
    */
   $scope.countSelect = function(){
   var count = 0;
   angular.forEach($scope.selectedTransaction.roomsDetails, function(value){
       if (value.isSelect) count++;
   });
   return count;
 }
 /**
  * functionName : checkAll()
  * Info : code used to get checkoutdetails on page init call
  * input : ...
  * output :...
  * createdDate - 4-9-2016
  * updated on -  4-9-2016 // reason for update
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
  * functionName : countChecked()
  * Info : code used to check selected room on transaction details
  * input : ...
  * output :...
  * createdDate - 4-9-2016
  * updated on -  4-9-2016 // reason for update
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
      $state.go('room_lists');
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
$scope.BookingCancel = function(){
  var obj={
    "_id" : $scope.selectedTransaction._id,
    "type" :"cancelBooking",
    "price"  :$scope.selectedTransaction.price,
    "discount":$scope.selectedTransaction.discount
  }
  transactionService.updateTransaction(obj,function(response) {
    console.log(obj);
      // $scope.getRoom(); // refresh the rooms
      $state.go('room_lists');
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
 * functionName : checkOutRoom()
 * Info : code used to checkout room
 * input : transaction details
 * output :...
 * createdDate - 5-9-2016
 * updated on -  5-9-2016 // reason for update
 */
/**
 * functionName : printInvoice()
 * Info : code used to printInvoice page after checkout
 * input : transaction details
 * output :...
 * createdDate - 5-9-2016
 * updated on -  5-9-2016 // reason for update
 */
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
  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;
})
