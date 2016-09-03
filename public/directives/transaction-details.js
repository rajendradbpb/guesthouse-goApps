angular.module('guest_house').directive("transactionDetails",function(){
  // var link = function ($scope, element, attrs) {
  //   /**
  //    * functionName :$scope.onSelectTransaction
  //    * Info : used to show the selected trasaction details
  //    * input : ...
  //    * output :...
  //    * createdDate - 4-9-2016
  //    * updated on -  4-9-2016// used to show the selected trasaction details
  //    */
  //   // $scope.onSelectTransaction = function(transaction){
  //   //   console.log(">>>>>>>>>>>>>>>>");
  //   //   $scope.selectedTransaction = transaction;
  //   //   $scope.currentTab = "transactionDetails";
  //   //
  //   // }
  //  }
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/transaction-details.html',
    scope: false,
    // link: link, //DOM manipulation
  };
})
