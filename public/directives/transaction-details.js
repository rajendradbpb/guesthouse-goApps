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
})
