app.controller("reportController", function($scope,$rootScope,UserService,$state,GuesthouseService,$stateParams,Util,UtilityService,transactionService,$timeout,Events) {
  $scope.filterType = 1;
  $scope.minDate = new Date();
    /**
     * functionName :   $scope.showreportList
     * Info : dependencies codes for Transaction report
     * input : ...
     * output :...
     * createdDate -21-9-2016
     * updated on -  21-9-2016 // reason for update
     */
    $scope.showreportList = function(){

    }
    $scope.gotoReportDetails = function(){
      var obj={
        "fromDate" : $scope.transactionReport.startDate,
        "toDate" : $scope.transactionReport.endDate
      }
      console.log(obj);
      if(moment($scope.transactionReport.endDate) < moment($scope.transactionReport.startDate)){
        //console.log("endDate < startDate");
        $scope.transactionReport.endDate = null;
      }
      else {
        //console.log("endDate > startDate");
        transactionService.getReport(obj,function(response) {
          console.log(response);
          console.log($scope.reportsList);
          $scope.reportsList = response.data;
          if(response.statusCode == 200){
            obj = {
              "type":"success",
              "message":response.message
            }
             $scope.$emit(Events.ALERT_MESSAGE,obj);
          }
          else {
            obj = {
              "type":"danger",
              "message":response.message
            }
             $scope.$emit(Events.ALERT_MESSAGE,obj);
          }
        })
      }
      $state.go('report_Details');
    }
    $scope.showReportDetails = function(reports){
      $scope.reportDetails = reports;
      $scope.ReportListTab('viewReport');
    }
})
