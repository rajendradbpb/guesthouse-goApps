app.controller("GuesthouseController", function($scope,$rootScope,UserService,$state,$stateParams,Util,GuesthouseService) {
  $scope.currentTab = 'roomlists';
  $scope.roomlistingTab = function(tab){
    $scope.currentTab = tab;
  }

  // $scope.getuser = function(){
  //   GuesthouseService.getuser(function(response){
  //     console.log(response);
  //     //$scope.user_list = response.data;
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
