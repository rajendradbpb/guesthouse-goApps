angular.module('guest_house').directive("transactionDetails",function(){
  // var link = function ($scope, element, attrs) {
  //
  //  }
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/transaction-details.html',
    //link: link, //DOM manipulation
  };
})
