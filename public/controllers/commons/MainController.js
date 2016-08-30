app.controller("MainController",function($scope,$rootScope,$localStorage,GuesthouseService,Constants,$state,UserService) {
  console.log($rootScope.logedInUser);
  $rootScope.loggedin = $localStorage[Constants.getLoggedIn()];
  $scope.signOut = function() {
    $rootScope.loggedin = false;
    delete $localStorage[Constants.getTokenKey()]
    $state.go("signIn");
  }
  $scope.roomStatus =
    {
      "AVAILABLE_AC_ROOMS":0,
      "AVAILABLE_NON_AC_ROOMS":0,
      "BOOKED_AC_ROOMS":0,
      "BOOKED_NON_AC_ROOMS":0,
      "BOOKED_AC_ROOMS" :0,
      "CHECKED_AC_ROOMS":0,
      "CHECKED_NON_AC_ROOMS":0,
      "SINGLE_BED":0,
      "DOUBLE_BED":0
    }
  $scope.onForgotPassword = function(email) {
    UserService.onForgotPassword({email:email},function(response) {
      console.log("email send success  ",response);
    },
    function(err) {
        console.log("email send error  ",err);
    }
  )
  }
  /*******************************************************/
  /********This code is to load room details in dashboard******/
  /*******************************************************/
  $scope.getAllRooms = function(){
    GuesthouseService.loadRoomByStatus(function(response){
      angular.forEach(response.data,function(item){
        switch(item._id.roomType){
          case 'AC':
            $scope.roomStatus.AVAILABLE_AC_ROOMS = item.count;
            break;
          case 'NON-AC':
            $scope.roomStatus.AVAILABLE_NON_AC_ROOMS = item.count;
            break;
          case 'SINGLE-BED':
            $scope.roomStatus.SINGLE_BED = item.count;
            break;
          case 'DOUBLE-BED':
            $scope.roomStatus.DOUBLE_BED = item.count;
            break;
           default :

        }
      });
    });
  }
})
