app.controller("MainController",function($scope,$rootScope,$localStorage,GuesthouseService,Constants,$state,UserService,transactionService) {
  $rootScope.showPreloader = false;
   $scope.find = {};
  $rootScope.loggedin = $localStorage[Constants.getLoggedIn()];
  $scope.signOut = function() {
    $rootScope.loggedin = false;
    delete $localStorage[Constants.getTokenKey()]
    $state.go("signIn");
  }
  $scope.menuChanged = function(menu,sref){
    $scope.menu = menu;
    if(sref)
      $state.go(sref);
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
  /********This code is to load room details in guest_house dashboard******/
  /*******************************************************/
  $scope.getAllRooms = function(){
      $rootScope.showPreloader = true;
    GuesthouseService.loadRoomByStatus(function(response){
      $rootScope.showPreloader = false;
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
  $scope.open = function() {
   $scope.popup.opened = true;
  };
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];
  $scope.popup = {
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

})
