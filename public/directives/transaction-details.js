angular.module('guest_house').directive("transactionDetails",function(){
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/transaction-details.html',
    scope: false,
    // link: link, //DOM manipulation
  };
})
