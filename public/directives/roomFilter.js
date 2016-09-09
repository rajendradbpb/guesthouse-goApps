/**
* directive :roomFilter
* Info : this is used to dynamically create the filter view as per the type value passed
  currently its using the parent controller where the directive is called
* input :
      @type - refer to the type of the filter view
* output :...
* createdDate -8-9-16
* updated on -  8-9-16 // reason for update
*/
angular.module('guest_house').directive("roomFilter",function(){
  var link = function ($scope, element, attrs) {
    $scope.type = attrs.type; // update the conditional view
   }
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/roomFilter.html',
    link: link, //DOM manipulation
    controller:'MainController'
  };
});
