angular.module('guest_house').directive("transactionDetails",function(){
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/transaction-details.html',
    scope: false,
    // link: link, //DOM manipulation
  };
})

    app.directive('dateviewer', function () {
    //    function linkfunction($scope, element, attributes) {
    //     // element.html("Student: <b>"+$scope.student.name +"</b> , Roll No: <b>"+$scope.student.rollno+"</b><br/>");
    //     element.css("background-color", "#ff00ff");
    //  }
