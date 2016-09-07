angular.module('guest_house').directive("transactionDetails",function(){
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/transaction-details.html',
    scope: false,
    // link: link, //DOM manipulation
  };
})
app.directive('datepicker', function () {
        return {
            restrict: 'A',
            controller: 'datepickerCtrl',
            controllerAs: 'dp',
            templateUrl: 'app/directive/datepicker.html',
        };
});
