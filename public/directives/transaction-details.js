angular.module('guest_house').directive("transactionDetails",function(){
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/transaction-details.html',
    scope: false,
    // link: link, //DOM manipulation
  };
})

// app.directive('dateviewer', function () {
//     return {
//         restrict: 'EA',
//         templateUrl: 'directives/views/datePicker.html',
//         controller:'MainController',
//          scope: false,
//         // link : linkfunction
//     };
// })
// app.directive('date', function () {
//     return {
//         restrict: 'EA',
//         templateUrl: 'directives/views/datepick.html',
//         controller:'MainController',
//          scope: false,
//         // link : linkfunction
//     };
// })
