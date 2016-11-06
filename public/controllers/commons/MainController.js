app.controller("MainController",function($scope,$rootScope,$localStorage,GuesthouseService,Constants,$state,UserService,transactionService,Events,Util, $location, $anchorScroll,$timeout) {
  $rootScope.showPreloader = false;
   $scope.find = {};
   $scope.dashboard = {};
  $rootScope.loggedin = $localStorage[Constants.getLoggedIn()];
  $scope.signOut = function() {
    $rootScope.loggedin = false;
    delete $localStorage[Constants.getTokenKey()]
    $state.go("signIn");
  }
  /**
   * functionName :$scope.viewList()
   * Info : used to dispatch event to fetch the rooms with the status from dashboard
   * createdDate - 24-10-2016
   * updated on - 24-10-2016
   */
  $scope.viewList = function(status) {
    obj = {
      "checkInDate" : ($scope.dashboard.checkinDate) ? moment($scope.dashboard.checkinDate).format("MM-DD-YYYY") : moment().format("MM-DD-YYYY"),
      "isDash"      : "1",
      "status"      : status
    };
    $state.go('room_lists',obj);
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
  $rootScope.$on(Events.ALERT_MESSAGE,function(event,data){
      $location.hash('top');
      $anchorScroll();
      Util.alertMessage(data.type, data.message);
  })
  $scope.$watch('dashboard.checkinDate',function(value){
    var obj={
         isDash:"1",
        "checkInDate":moment($scope.dashboard.checkinDate).format("MM-DD-YYYY")
      }
      GuesthouseService.getRoom(obj,function(response){
            console.log(response);
            $rootScope.showPreloader = false;
            $scope.roomStatus = response.data;
            console.log("room status  ",response.data);
          },function(err) {
            $rootScope.showPreloader = false;
            console.log("error room status  ",err.data);
          })
  })
  /*******************************************************/
  /********This code is to load room details in guest_house dashboard******/
  /*******************************************************/
  $scope.getAllRooms = function(){
      $rootScope.showPreloader = true;
      var obj = {
        isDash:"1",
        "checkInDate" : moment().format("MM-DD-YYYY")
      }
      GuesthouseService.getRoom(obj,function(response){
        $rootScope.showPreloader = false;
        $scope.roomStatus = response.data;
        console.log("room status  ",response.data);
      },function(err) {
        $rootScope.showPreloader = false;
        console.log("error room status  ",err.data);
      })
    // GuesthouseService.loadRoomByStatus(function(response){
    //   $rootScope.showPreloader = false;
    //   angular.forEach(response.data,function(item){
    //     switch(item._id.roomType){
    //       case 'AC':
    //         $scope.roomStatus.AVAILABLE_AC_ROOMS = item.count;
    //         break;
    //       case 'NON-AC':
    //         $scope.roomStatus.AVAILABLE_NON_AC_ROOMS = item.count;
    //         break;
    //       case 'SINGLE-BED':
    //         $scope.roomStatus.SINGLE_BED = item.count;
    //         break;
    //       case 'DOUBLE-BED':
    //         $scope.roomStatus.DOUBLE_BED = item.count;
    //         break;
    //        default :
    //     }
    //   });
    // });
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
