angular.module('guest_house').directive("transactionDetails",function(){
  var link = function(scope, element, attrs) {
  }
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/transaction-details.html',
    scope: {
      transaction:"=",
      onSelectTransaction:"&"

    },
    link: link, //DOM manipulation
    controller:"transactionDetailsController"
  };
})
.controller("transactionDetailsController" , function($scope) {
  $scope.getTransactionDetails = function(transaction) {
    $scope.onSelectTransaction(transaction);
  }
  $scope.getRoomsNos = function(transaction) {
      var roomNos = [];
      for(var i in transaction.roomsDetails){
        if(transaction.roomsDetails[i] && transaction.roomsDetails[i].room)
          roomNos.push(transaction.roomsDetails[i].room.roomNo);
    }
    return roomNos.toString();
  }
})
