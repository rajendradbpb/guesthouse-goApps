angular.module('guest_house').directive("reportDetails",function(){
  var link = function($scope, element, atttributes){
    $scope.$watch('reports',function(reports) {
      console.log("reports updated",reports);
      $scope.reports = reports;
    })
  }
  var reportDetailsController = function($scope){
    $scope.showReportDetails = function(report) {

    }
  }
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/report-details.html',
    scope: {
      reports:"="
    },
    controller:reportDetailsController,
    link: link, //DOM manipulation
  };
})
