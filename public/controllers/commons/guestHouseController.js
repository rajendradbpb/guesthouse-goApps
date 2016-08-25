app.controller("GuesthouseController", function($scope,$rootScope,UserService,$state,$stateParams,Util,GuesthouseService) {
  $scope.currentTab = 'guestHouseDetails';
  $scope.guestHouseTab = function(tab){
    $scope.currentTab = tab;
  }
  $scope.open2 = function() {
   $scope.popup2.opened = true;
  };
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];
  $scope.popup2 = {
    opened: false
  };
  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
  // $scope.getuser = function(){
  //   GuesthouseService.getuser(function(response){
  //     $scope.user_list = response.data;
  //   });
  // }
  $scope.submitguestHouse = function(){
    // var obj={
    //   "user":$scope.ghUser.username,
    //   "name":$scope.ghUser.name,
    //   "mobile":$scope.ghUser.mobile,
    //   "phone":$scope.ghUser.phone,
    //   "minPrice":$scope.ghUser.minprice,
    //   "maxPrice":$scope.ghUser.maxprice,
    //   "establishDate":$scope.ghuser.date
    // }
    // console.log(obj);
    GuesthouseService.submitguestHouse($scope.ghUser,function(response){
      console.log(response);
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
      }
      else {
          Util.alertMessage('danger', response.message);
      }
    })
  }
})
