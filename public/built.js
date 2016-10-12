/*! GuestHouse - v0.0.0 - Sat Oct 08 2016 19:53:22 */
app = angular.module("guest_house", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate','datePicker','ngCookies']);
app.config(function($stateProvider, $urlRouterProvider,$httpProvider,Constants) {

  //adding http intercepter
  $httpProvider.interceptors.push(function ($q, $location, $window,$localStorage) {
      return {
          request: function (config) {
              config.headers = config.headers || {};
              config.headers['Authorization'] = 'bearer '+$localStorage[Constants.getTokenKey()];
              return config;
          },
          response: function (response) {
              if (response.status === 401) {
                  // handle the case where the user is not authenticated
                  $location.path('/');
              }
              return response || $q.when(response);
          }
      };
  });

  function checkLoggedin($q, $timeout, $http, $location, $rootScope, $state,$localStorage,$rootScope) {
      var deferred = $q.defer();
      // Make an AJAX call to check if the user is logged in
      $http.get('/user/loggedin').success(function (response) {
          if (response.status == 'OK') {
              $timeout(function () {
                  deferred.resolve();
                  $state.go("ccare-dashboard");
              }, 100);
          }
          else {
              $timeout(function () {
                  deferred.resolve();
              }, 100);
              // $state.go('signIn');
          }
      }).error(function(err) {
        $rootScope.loggedin = $localStorage[Constants.getLoggedIn()] = false;
        $timeout(function () {
            deferred.resolve();
        }, 100);
        // $state.go('signIn');
      })

      return deferred.promise;
  };
  function checkLoggedout ($q, $timeout,UtilityService, $http, $location, $rootScope, $state,$localStorage,UserService) {
      var deferred = $q.defer();
      $http.get('/user/loggedin').success(function (response) {
        $rootScope.logedInUser = response.user;
          if(typeof UtilityService.getUserSettings() != 'object'){
            $http.get('/user/settings').success(function (res) {
              UtilityService.setUserSettings(res.data);
            })
          }
          if (response.status == 'OK') {
              $timeout(deferred.resolve, 0);
          }
          else {
              $rootScope.loggedin = $localStorage[Constants.getLoggedIn()] = false;
              $timeout(function () {
                  deferred.resolve();
              }, 0);
              $state.go('signIn');
          }
      }).error(function(err) {
        $rootScope.loggedin = $localStorage[Constants.getLoggedIn()] = false;
        $timeout(function () {
            deferred.resolve();
        }, 0);
        $state.go('signIn');
      });
      return deferred.promise;
  };
    $urlRouterProvider.otherwise('/signIn');
    $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================
        .state('ccare-dashboard', {
            templateUrl: 'pages/dashboard.html',
            url: '/ccare-dashboard',
            controller:"MainController",
            resolve: {loggedout: checkLoggedout},
        })
        .state('admin-dashboard', {
            templateUrl: 'pages/adminDashboard.html',
            url: '/admin-dashboard',
            controller:"MainController",
            resolve: {loggedout: checkLoggedout},
        })
        .state('guest_house-dashboard', {
            templateUrl: 'pages/guesthouseDashboard.html',
            url: '/guest_house-dashboard',
            controller:"MainController",
            resolve: {loggedout: checkLoggedout},
        })
        .state('signIn', {
            templateUrl: 'pages/signIn.html',
            url: '/signIn',
            controller:"SignInController",
            resolve: {loggedin: checkLoggedin},

        })
        .state('userProfile', {
            templateUrl: 'pages/users/userProfile.html',
            url: '/userProfile',
            controller:"UserController",
            resolve: {loggedin: checkLoggedout},

        })
        .state('forgot-password', {
            templateUrl: 'pages/forgotPassword.html',
            url: '/forgot-password',
            controller:"MainController",
            resolve: {loggedin: checkLoggedin},
        })
        .state('new-user', {
            templateUrl: 'pages/newUser.html',
            url: '/new-user',
            controller:"UserController",
            resolve:{loggedin: checkLoggedout}
        })
        .state('customer-details', {
            templateUrl: 'pages/customer/customerDetail.html',
            url: '/customer-details',
            controller:'CustomerController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('edit-customer',{
             templateUrl:'pages/customer/editCustomer.html',
             url:'/edit-customer/:_id',
             controller:'CustomerController',
             resolve: {loggedin: checkLoggedout},
        })
        .state('customer-booking',{
             templateUrl:'pages/customer/customerBooking.html',
             url:'/customer-booking',
             controller:'CustomerController',
             resolve: {loggedin: checkLoggedout},
        })
        .state('room-setttings', {
            templateUrl: 'pages/guestHouseUser/roomSettings.html',
            url: '/room-setttings',
            controller:'GuesthouseController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('newRoom_details',{
            templateUrl: 'pages/guestHouseUser/newRoomDetails.html',
            url: '/newRoom_details',
            controller:'GuesthouseController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('transaction_details',{
            templateUrl: 'pages/transaction/transaction_Details.html',
            url: '/transaction_details',
            controller:'transactionController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('transaction_Report',{
            templateUrl: 'pages/transaction/transaction_report.html',
            url: '/transaction_Report',
            controller:'transactionController',
            resolve: {loggedin: checkLoggedout},
        })
});
app.factory('Util', ['$rootScope',  '$timeout' , function( $rootScope, $timeout){
    var Util = {};
    $rootScope.alerts =[];
    Util.alertMessage = function(msgType, message){
        console.log(1212121);
        var alert = { type:msgType , msg: message };
        $rootScope.alerts.push( alert );
         $timeout(function(){
            $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
         }, 5000);
    };
    return Util;
  }]);
;app.controller("MainController",function($scope,$rootScope,$localStorage,GuesthouseService,Constants,$state,UserService,transactionService) {
  $rootScope.showPreloader = false;
   $scope.find = {};
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
;app.controller("SignInController",["$scope","$rootScope","CommonService","$state","Constants","$localStorage",function($scope,$rootScope,CommonService,$state,Constants,$localStorage) {
  $scope.user = {};
  $scope.signIn = function(user){
    $rootScope.showPreloader = true;
    CommonService.signIn(user,function(pres) {
    $rootScope.showPreloader = false;
      // saving the token if exists
      // $localStorage[Constants.storagePrefix+"$token"] =
      if(pres.data.token){
        //saving token in the local storage
        $localStorage[Constants.getTokenKey()] = pres.data.token;
        $localStorage[Constants.getLoggedIn()] = true;
        $rootScope.loggedin = $localStorage[Constants.getLoggedIn()];
        switch (pres.data.role) {
          case "ccare":
          $state.go("ccare-dashboard");
          break;
          case "admin":
          $state.go("admin-dashboard");
          break;
          case "ghUser":
          $state.go("guest_house-dashboard");
          break;
          case "ghAdmin":
          break;
          default:
        }
      }
      else{
        $state.go(signIn);
          // Util.alertMessage('danger', pRes.data.message);
      }
    },
    function(err) {
      console.log("err",err);

    }

    )
  }
}])
;app.controller("UserController", function($scope,$rootScope,CommonService,$state,Constants,$localStorage,UserService,Util) {
  $scope.currentTab = 'myprofile';
  $scope.user = {};
  $scope.user.establishDate = "11-02-2016";
  /*******************************************************/
  /*************This is use for change the tab************/
  /*******************************************************/
  $scope.changeTab = function(tab){
    $scope.currentTab = tab;
  }
  /*******************************************************/
  /********This is use for load the loged in profile******/
  /*******************************************************/
  $scope.$watch($rootScope.logedInUser,function(){
    $scope.userProfile = angular.copy($rootScope.logedInUser);
  })
  /*******************************************************/
  /********This is use for update the profile details*****/
  /*******************************************************/
  $scope.updateMyProfile = function(){
    var obj = {
      "firstName": $scope.userProfile.firstName,
      "lastName": $scope.userProfile.lastName,
      "middleName": $scope.userProfile.middleName,
      "email": $scope.userProfile.email
    }
    $rootScope.showPreloader = true;
    UserService.updateUser(obj,function(response){
    $rootScope.showPreloader = false;
      $localStorage[Constants.getTokenKey()] = response.data.token;
      $rootScope.logedInUser = response.data.user;
      Util.alertMessage('success', response.message);
    });

  }
  /*******************************************************/
  /**************This is use for change password**********/
  /*******************************************************/
  $scope.changePassword = function(){
    var obj = {
      "oldPassword": $scope.password.current,
      "newPassword": $scope.password.confirm
    }
    $rootScope.showPreloader = true;
    UserService.changePassword(obj,function(response){
    $rootScope.showPreloader = false;
      Util.alertMessage('success', response.message);
    });
  }
  /*******************************************************/
  /**************This is use for getting all role type in asign role dropdown**********/
  /*******************************************************/
  $scope.getRoleType = function(){
    $rootScope.showPreloader = true;
    if($scope.roleType && $scope.roleType.length > 0)
    return;
    UserService.getRoleType(function(response){
    $rootScope.showPreloader = false;
      console.log(response);
      $scope.roleType = response.data;
       // to udpate the user role on init roles
      $scope.selectedRole = $scope.roleType[0];
      $scope.onSelectRole();
    });
  }
  /*******************************************************/
  /**************This is use for submit user details**********/
  /*******************************************************/
  $scope.submitUserDetails = function(){
      $rootScope.showPreloader = true;
    UserService.submitUserDetails($scope.user,function(response){
      console.log(response);
      $rootScope.showPreloader = false;
      Util.alertMessage('success', response.message);
    });
  }
  /**
   * functionName :onSelectRole
   * Info : to udpate the user role id
   *
   * createdDate - 8-9-16
   * updated on -  8-9-16 // reason for update
   */
   $scope.onSelectRole = function(){
     $scope.user.role = $scope.selectedRole._id;
   }
})
;app.controller("CustomerController", function($scope,$rootScope,$state,$stateParams,CustomerService,Util) {
$scope.currentTab = 'customerList';
$scope.find = {};

$scope.changeTab = function(tab){
  if(tab == 'customerList'){
    $scope.loadAllCustomer();
  }
  $scope.currentTab = tab;
}
$scope.currentTab1 = 'customerdetail';
$scope.changeBookingTab = function(tab){
  $scope.currentTab1 = tab;
}
/*******************************************************/
/********This is use for submitting customer details******/
/*******************************************************/
$scope.submitCustDetails = function(){
      $rootScope.showPreloader = true;
  CustomerService.submitCustDetails($scope.customer,function(response){
      $rootScope.showPreloader = false;
    if(response.statusCode == 200){
        Util.alertMessage('success', response.message);
    }
  },function(err) {
    Util.alertMessage('danger', err.message);
  })
}
/*******************************************************/
/********This is use to load all customer details******/
/*******************************************************/
$scope.loadAllCustomer = function(){
  $rootScope.showPreloader = true;
  CustomerService.getCustomerList(function(response){
    $rootScope.showPreloader = false;
      $scope.allcoustomers = response.data;
  })
}
/*******************************************************/
/********This is use to edit customer data by using id******/
/*******************************************************/
$scope.goToEdit = function(_id){
    $state.go('edit-customer',{_id:_id})
  }
  /*******************************************************/
  /********This is use for loading customer data using their id******/
  /*******************************************************/
$scope.getCustomerbyID = function(){
    var obj ={
      "id":$stateParams._id
    }
    $rootScope.showPreloader = true;
    CustomerService.getCustomerList(obj,function(response){
     $rootScope.showPreloader = false;
      $scope.customer = response.data[0];
    })
  }
  /*******************************************************/
  /********This is use to update customer data******/
  /*******************************************************/
  $scope.updateCustomer = function(){
    $rootScope.showPreloader = true;
    CustomerService.updateCustomerbyID($scope.customer,function(response){
      $rootScope.showPreloader = false;
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
      }

   },function(err) {
     Util.alertMessage('danger', err.message);
   })
 }
 /*******************************************************/
 /********This is use to delete customer data from list******/
 /*******************************************************/
 $scope.deletecustomer = function(id){
     var obj = {
      "_id":id
     }
     $rootScope.showPreloader = true;
     CustomerService.deleteCustomer(obj,function(response) {
       $rootScope.showPreloader = false;
       $scope.loadAllCustomer();
    })
   }
   /*******************************************************/
   /********This is use to search customer using mobile no******/
   /*******************************************************/
   $scope.getCustomerInfo = function(){
     $scope.customer = {};
     $scope.is_searched = true;
     var mobile = {
       "mobile" :$scope.find.mobile
     }
     $rootScope.showPreloader = true;
     CustomerService.getCustomerList(mobile,function(response) {
       $rootScope.showPreloader = false;
       if(response.data.length > 0){
        $scope.customer =  response.data[0];
        $scope.customerFound = true;
       }
       else{
         $scope.customer = {};
         $scope.customer.mobile = $scope.find.mobile;
       }
     },function(err) {
       Util.alertMessage('danger', err.message);
     })
   }
})
;app.controller("GuesthouseController", function($scope,$rootScope,UserService,$state,$stateParams,Util,UtilityService,GuesthouseService) {
  $scope.currentTab = 'roomlists';
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  console.log($scope.roomFeature);
  $scope.roomlistingTab = function(tab){
    $scope.currentTab = tab;
  }
  //$scope.currentTab = 'roomlists';
  $scope.transactionTab = function(tab){
    $scope.currentTab = tab;
  }
  /*******************************************************/
  /********This is use for loading room facilities during page load******/
  /*******************************************************/
  $scope.newRoomInit = function() {
    $rootScope.showPreloader = true;
    GuesthouseService.getFacilities(
      function(response){
          $rootScope.showPreloader = false;
          if(response.statusCode == 200){
              $scope.facilities = response.data;
              console.log($scope.facilities);
          }
          else {
              Util.alertMessage('danger', response.message);
          }
      },
      function(err){
            Util.alertMessage('danger', err.message);
      }
    )
  }
  /*******************************************************/
  /********This code is for adding new room details******/
  /*******************************************************/
  $scope.addRoom = function(form) {
    $scope.room.facility = UtilityService.getSelectedIds($scope.facilities,"isChecked",true);
    var roomfacility =$scope.room.facility;
    $rootScope.showPreloader = true;
    var obj ={
      "roomNo":$scope.room.roomNo,
      "roomType" :$scope.room.roomType,
      "price" :$scope.room.price,
      // "isOffer" :$scope.isoffer.checked,
      // "offerPrice":$scope.room.offerprice,
      "facility":roomfacility,
      "capacity ":$scope.room.capacity,
      "guestHouse" : $rootScope.logedInUser._id
    }
    if($scope.isoffer){
      obj.isOffer = true;
      obj.offerPrice = $scope.room.offerprice;
    }
    else {
      $scope.room.offerprice = null;
    }
    GuesthouseService.addRoom(obj, function(response){
    $rootScope.showPreloader = false;
      console.log($scope.room);
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
      }
      else {
          Util.alertMessage('danger', response.message);
      }
    },function(err){
      Util.alertMessage('danger', err.message);
    });
  }
  /*******************************************************/
  /********This code is used to get all the room lists******/
  /*******************************************************/
  $scope.getRoom = function(){
    $rootScope.showPreloader = true;
    var obj = {
       "checkInDate" : moment().format("MM-DD-YYYY")
    };
    GuesthouseService.getRoom(obj,function(response){
      console.log($scope.room_list);
      $rootScope.showPreloader = false;
      $scope.room_list = response.data;

    })
  }
  $scope.getRoomDetails = function(room){
    $scope.currentTab = 'roomdetails';
    $scope.room = room;
    console.log($scope.room);
    angular.forEach($scope.facilities,function(item){
       item.isChecked = false;
      if($scope.room.facility.length > 0){
        angular.forEach($scope.room.facility,function(facility){
          if(facility == item._id){
             item.isChecked = true;
          }
        })
      }
    });
  }
  /*******************************************************/
  /********This code is to update room details******/
  /*******************************************************/
  $scope.updateRoomDetails = function(){
    $scope.room.facility = UtilityService.getSelectedIds($scope.facilities,"isChecked",true);
    $rootScope.showPreloader = true;
    GuesthouseService.updateroomByID($scope.room,function(response){
      $rootScope.showPreloader = false;
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
      }
      else {
          Util.alertMessage('danger', response.message);
      }
    },function(err){
      Util.alertMessage('danger', err.message);
    });
  }
  /*******************************************************/
  /********This code is to delete room details******/
  /*******************************************************/
  $scope.deleteRoom = function(id){
    console.log(id);
      var obj = {
       "_id":id
      }
      $rootScope.showPreloader = true;
      GuesthouseService.deleteRoom(obj,function(response) {
      $rootScope.showPreloader = false;
      console.log(response);
        if(response.statusCode == 200){
            $scope.getRoom();
        }
     })
    }
})
;app.controller("transactionController", function($scope,$rootScope,UserService,$state,GuesthouseService,$stateParams,Util,UtilityService,transactionService,$timeout) {
  $scope.currentTab = 'roomlists';
  $scope.filterType = 1;
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  $scope.transactionTab = function(tab){
    $scope.currentTab = tab;
  }
   $scope.currentTab1 = 'ReportList';
  $scope.ReportListTab = function(tab){
    $scope.currentTab1 = tab;
  }
  /*******************************************************/
  /*******This code is used to get all the room lists*****/
  /*******************************************************/
  $scope.getRoom = function(){
    $rootScope.showPreloader = true;
    var obj = {
       "checkInDate" : moment().format("MM-DD-YYYY")
    };
    GuesthouseService.getRoom(obj,function(response){
      $rootScope.showPreloader = false;
      $scope.room_list = response.data;
   })
  }
  $scope.getRoomDetails = function(room){
    $scope.currentTab = 'roomdetails';
    $scope.room = room;
    angular.forEach($scope.facilities,function(item){
       item.isChecked = false;
      if($scope.room.facility.length > 0){
        angular.forEach($scope.room.facility,function(facility){
          if(facility == item._id){
             item.isChecked = true;
          }
        })
      }
    });
  }
  $scope.bookRoom = function(_id){
    $scope.selectedRooms = [];
    $scope.selectedRoomsPrice = 0;
    angular.forEach($scope.room_list.availableRooms,function(room,key) {
      if(room.isChecked){
        $scope.selectedRooms.push(room);
        $scope.selectedRoomsPrice+=room.price;
      }
    });
    $scope.initCheckIn();
    $scope.currentTab = 'checkIn';
  }
  /**
   * functionName : initCheckIn
   * Info : codes to get room id of selected rooms
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.initCheckIn = function() {
    // get the selected rooms No
    $scope.selectedRoomsNo = UtilityService.getSelectedItemByProp($scope.selectedRooms,"isChecked",true,"roomNo");
    $scope.selectedRoomID = UtilityService.getSelectedItemByID($scope.selectedRooms,"isChecked",true,"_id");
    console.log($scope.selectedRoomID);
  }
  /**
   * functionName : submitNewBooking
   * Info : codes for submitting new booking/transaction details
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.submitNewBooking = function(bookroom){
    $rootScope.showPreloader = true;
    var obj ={
      "otp":$scope.transaction.otp,
      "cName":$scope.transaction.cName,
      "cMobile":$scope.transaction.cMobile,
      "address":$scope.transaction.address,
      "rooms" :$scope.selectedRoomID,
      // "price" :$scope.selectedRoomsPrice,
      "transactionNo":$scope.transaction.transactionNo,
      "idproofno" :$scope.transaction.idproofno,
      "identity" : $scope.transaction.identity,
      "purpose"    : $scope.transaction.purpose,
      "checkInDate" : moment($scope.transaction.checkInDate).format("MM-DD-YYYY"),
      "checkOutDate" : moment($scope.transaction.checkOutDate).format("MM-DD-YYYY"),
      "bookingStatus" : $scope.transaction.status,
      "guestHouse" : $rootScope.logedInUser._id
    }
    console.log("before save  ",JSON.stringify(obj));
    transactionService.addTransaction(obj,function(response){
    $rootScope.showPreloader = false;
      if(response.statusCode == 200){
          Util.alertMessage('success', response.message);
          // refresh the room list and change the tab to the room list
          $timeout(function() {
            $scope.getRoom();
            $scope.currentTab = 'roomlists';
            // $scope.transaction = {};
            // UtilityService.resetForm(bookroom);
          },2000)
      }
      else {
          Util.alertMessage('danger', response.message);
      }
    })
  };
   /**
    * $scope.$watch('currentTab')
    * This will caleed from the transaction listing page
    * input : this takes as string for the trasaction numner , Customer name , mobile No etc
    * output : list of the trasaction
    * createdDate - 4-9- 2016
    * updated on -  4-9- 2016
    */

   $scope.$watch('currentTab',function(value) {
     if(value == "transaction"){
       $scope.filterType = 2;
       // call the service to get the trasactions
       transactionService.getTransaction(function(response) {
         $scope.trasactionList = response.data
       },
       function(err){
         Util.alertMessage('error', err.message);
       }
     )
     }
     else if(value == "checkOut"){
       // assign  the checkin date with the check out date , user may change that
       $scope.selectedTransaction.checkOutDate = $scope.selectedTransaction.checkInDate;
     }
     else if(value == "roomlists"){
       // update the filter type = 1
       $scope.filterType = 1;
     }
   })

   /**
    * $scope.$watch('selectedTransaction.checkOutDate')
    * This is used to udpate the price of the transaction based on the checkInDate and the checkOutDate
    *
    * createdDate - 4-9- 2016
    * updated on -  4-9- 2016
    */

   $scope.$watch('selectedTransaction.checkOutDate',function(value) {
     if(!$scope.selectedTransaction)
     return;
     if(moment($scope.selectedTransaction.checkOutDate).isBefore($scope.selectedTransaction.roomsDetails[0].checkInDate, 'days')){
       $scope.selectedTransaction.checkOutDate = null;
     }
     else {
       var from = moment($scope.selectedTransaction.roomsDetails[0].checkInDate);
       var to = moment($scope.selectedTransaction.checkOutDate);
       var different = to.diff(from,'days');
       $scope.selectedTransaction.totalPrice = $scope.roomPrice * different;
       $scope.tempTotPrice = $scope.selectedTransaction.totalPrice;
     }
   })

   /**
    * $scope.serchTransaction
    * This will caleed from the transaction listing page
    * input : this takes as string for the trasaction numner , Customer name , mobile No etc
    * output : list of the trasaction
    * createdDate - 4-9- 2016
    * updated on -  4-9- 2016
    */
   $scope.serchTransaction = function(searchStr) {
     // call the service to get the trasactions
     var obj = {
       searchStr:searchStr
     }
     transactionService.getTransaction(obj,function(response) {
       $scope.trasactionList = response.data
     },
       function(err){
         Util.alertMessage('error', err.message);
       }
     )
   }
   /**
    * functionName : onSelectTransaction
    * Info : keeps the data of the current selected transaction and show in the transaction detials
    * input : ...
    * output :...
    * createdDate - 4-9-2016
    * updated on -  4-9-2016 // reason for update
    */
   $scope.onSelectTransaction = function(transaction){
     $scope.selectedTransaction = transaction;
     console.log($scope.selectedTransaction);
     angular.forEach($scope.selectedTransaction.roomsDetails,function(room){
       room.isSelect = false;
       room.checkInDate = moment(room.checkInDate).format('YYYY-MM-DD');
       room.checkOutDate = moment(room.checkOutDate).format('YYYY-MM-DD');
       if(moment($scope.selectedTransaction.checkOutDate).isBefore($scope.selectedTransaction.roomsDetails[0].checkInDate, 'days')){
         $scope.selectedTransaction.checkOutDate = null;
       }
       else {
         var from = moment($scope.selectedTransaction.checkInDate);
         var to = moment($scope.selectedTransaction.checkOutDate);
         var different = to.diff(from,'days');
         console.log(different);
         if(different == 0){
           $scope.selectedTransaction.totalPrice = $scope.selectedTransaction.roomsDetails[0].price * 1;
         }
         else {
           $scope.selectedTransaction.totalPrice = $scope.selectedTransaction.roomsDetails[0].price * different;
         }
         $scope.tempTotPrice = $scope.selectedTransaction.totalPrice;
       }
     });
     $scope.transactionTab('transactionDetails');
     $scope.ReportListTab('Transactiondetails');
   }
   /**
    * functionName : calculateDiscount
    * Info : used to make the room AVAILABLE and update the price as per the selected checkInDate and the checkOutDate and the payment
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.calculateDiscount = function(){
     if($scope.selectedTransaction.totalPrice < $scope.tempTotPrice){
       $scope.selectedTransaction.discount = $scope.tempTotPrice - $scope.selectedTransaction.totalPrice;
     }
     else {
       if($scope.selectedTransaction.totalPrice > $scope.tempTotPrice){
         $scope.selectedTransaction.discount = 0;
       }
     }
   }
   /**
    * functionName : gotoCheckOut
    * Info : used to make the room AVAILABLE and update the price as per the selected checkInDate and the checkOutDate and the payment
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.gotoCheckOut = function(operation){
     $scope.operationType = operation;
     $scope.roomPrice = 0;
     $scope.selectedTransaction.discount = 0;
     $scope.transactionTab('checkOut');
     angular.forEach($scope.selectedTransaction.roomsDetails,function(room){
       if(room.isSelect){
         $scope.roomPrice += room.price;
       }
     })
   }
   /**
    * functionName : checkOut
    * Info : used to make the room AVAILABLE and update the price as per the selected checkInDate and the checkOutDate and the payment
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.checkOut = function(transaction){
     var obj = {
       "_id": $scope.selectedTransaction._id,
       "price": $scope.operationType == "checkOut" ? parseFloat($scope.selectedTransaction.totalPrice):0,
       "discount":$scope.operationType == "checkOut" ? $scope.selectedTransaction.discount:0,
       "type":$scope.operationType,
       "rooms":[]
     }
     angular.forEach($scope.selectedTransaction.roomsDetails,function(item){
       if(item.isSelect){
         obj.rooms.push(item.room._id);
       }
     })
     transactionService.updateTransaction(obj,function(response) {
        console.log(response);
        // $scope.getRoom(); // refresh the rooms
        // $scope.transactionTab('roomlists');
     },
     function(err){
       Util.alertMessage('error', err.message);
     });
   }
   /**
    * functionName : checkin_booked
    * Info : used to make the room checkedIn if the room is booked
    * input : transaction details
    * output :...
    * createdDate - 5-9-2016
    * updated on -  5-9-2016 // reason for update
    */
   $scope.checkin_booked = function(){
     var obj={
       "_id":$scope.selectedTransaction._id,
       "type" :"checkedIn"
     }
     transactionService.updateTransaction(obj,function(response) {
         $scope.getRoom(); // refresh the rooms
         $scope.transactionTab('roomlists');
     })
   }
    /**
     * functionName : $scope.newRoomInit()
     * Info : dependencies codes for the date picker
     * input : ...
     * output :...
     * createdDate - 4-9-2016
     * updated on -  4-9-2016 // reason for update
     */
    $scope.newRoomInit = function() {
      transactionService.getFacilities(
        function(response){
            if(response.statusCode == 200){
                $scope.facilities = response.data;
            }
            else {
                Util.alertMessage('danger', response.message);
            }
        },
        function(err){
              Util.alertMessage('danger', err.message);
        }
      )
    }
    /**
     * functionName :   $scope.checkDate
     * Info : dependencies codes for Transaction report
     * input : ...
     * output :...
     * createdDate -21-9-2016
     * updated on -  21-9-2016 // reason for update
     */
    $scope.checkDate = function(){
      var obj={
        "fromDate" : $scope.transactionReport.startDate,
        "toDate" : $scope.transactionReport.endDate
      }
      if(moment($scope.transactionReport.endDate) < moment($scope.transactionReport.startDate)){
        //console.log("endDate < startDate");
        $scope.transactionReport.endDate = null;
      }
      else {
        $scope.currentTab1 = 'Reportdetails';
        //console.log("endDate > startDate");
        transactionService.getReport(obj,function(response) {
          $scope.reportsList = response.data;
        })
      }
    }
     $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.selectedTransaction.roomsDetails, function (room) {
            room.isSelect = $scope.selectedAll;
        });
    };
    /**
     * functionName :   $scope.changeStatus
     * Info :codes for check all rooms by checking select all checkbox
     * input : ...
     * output :...
     * createdDate -23-9-2016
     * updated on -  23-9-2016 // reason for update
     */
    $scope.changeStatus = function(){
      $scope.transaction.checkInDate = ($scope.transaction.status == 'CHECKED-IN') ? moment().format("YYYY-MM-DD") :'';
    }
})
;app.factory("CommonService", ["$http","$resource", function($http,$resource) {
  var jobs = [];

  // var CommonOperation = function() {
    return $resource('/',null, {
        signIn: {
            method: 'POST',
            url:"/user/signIn",
            headers:"application/json"
        },
    });
  // }
  // return {
  //     CommonOperation:CommonOperation
  // }
}])
;app.factory("UserService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
      updateUser: {
          method: 'PUT',
          url:"/user",
          headers:"application/json"
      },
      changePassword: {
          method: 'POST',
          url:"/user/changePassword",
          headers:"application/json"
      },
      getRoleType: {
        method:'GET',
        url:"/admin/role",
        headers:"application/json"
      },
      loggedIn: {
        method:'GET',
        url:"/user/loggedin",
        headers:{
          "Content-type" : "application/json" ,
          "Authorization" : "bearer "+$localStorage[Constants.getTokenKey()] ,
        }
      },
      submitUserDetails:{
        method: 'POST',
        url:"/user",
        headers:"application/json"
      },
      onForgotPassword:{
        method: 'PUT',
        url:"/user/forgetPassword",
        headers:{"Content-type":"application/json"}
      }
  });
})
;app.factory("CustomerService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
     submitCustDetails:{
        method: 'POST',
        url:"/customer",
        headers:"application/json"
     },
     getCustomerList: {
        method: 'GET',
        url:"/customer",
        headers:"application/json"
     },
     updateCustomerbyID : {
       method: 'PUT',
       url:"/customer",
       headers:"application/json"
     },
     deleteCustomer : {
       method: 'DELETE',
       url:"/customer",
       headers:"application/json"
     },
     addNewBooking: {
        method: 'GET',
        url:"/customer",
        headers:"application/json"
     }
  });
})
;app.factory("GuesthouseService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
    addRoom: {
      method:'POST',
      url:"/guestHouse/room",
      headers:"application/json"
    },
    getFacilities: {
        method:'GET',
        url:"/facility",
        headers:"application/json"
    },
  submitguestHouse:{
       method: 'POST',
       url:"/guestHouse",
       headers:"application/json"
  },
  getRoom : {
       method:'GET',
       url:"/guestHouse/room",
       headers:"application/json"
  },
  updateroomByID : {
      method:'PUT',
      url:"/guestHouse/room",
      headers:"application/json"
  },
  deleteRoom : {
      method: 'DELETE',
      url:"/guestHouse/room",
      headers:"application/json"
  },
  loadRoomByStatus :{
      method:'GET',
      url:"/guestHouse/room?isDash=1",
      headers:"application/json"
  }
  });
})
;app.factory("UtilityService", function($http,$resource,$localStorage,Constants) {
  var userSettings;
  var getSelectedIds = function(array,prop,matchValue){
    var arr = [];
    angular.forEach(array,function(value,key) {

      if(value[prop] == matchValue)
        arr.push(value._id);
    });
    return arr;
  };
  /**
   * functionName :getSelectedItemByProp
   * Info : this is used to give the required property on matching the condition given and give the result in array
   * input :
        @array - input array
        @prop - prop to be parse (in case of null skip the conditon checking and loop for all iterration)
        @matchValue - condition to match @prop
        @returnProp - property to be returned
   * output : array
   * createdDate - 5-9-2016
   * updated on -  5-9-2016 // reason for update
   */
  var getSelectedItemByProp = function(array,prop,matchValue,returnProp){
    var arr = [];
    angular.forEach(array,function(value,key) {

      if(prop && value[prop] == matchValue)
        arr.push(value[returnProp]);
      else if (!prop) {
        // in case of the match property not mentioned then add the Required property
        arr.push(value[returnProp]);
      }
    });
    return arr;
  };
  var getSelectedItemByID = function(array,prop,matchValue,returnProp){
    var arr = [];
    angular.forEach(array,function(value,key) {

      if(value[prop] == matchValue)
        arr.push(value[returnProp]);
    });
    return arr;
  };
  var getUserSettings = function(){
    return userSettings;
  };
  var setUserSettings = function(obj){
    userSettings = obj;
  }
  var resetForm = function(form){
    if(!form)
    return;
    form.$setPristine();
  }
  return{
    getSelectedIds:getSelectedIds,
    getSelectedItemByProp:getSelectedItemByProp,
    getSelectedItemByID:getSelectedItemByID,
    getUserSettings    : getUserSettings,
    setUserSettings    : setUserSettings,
    resetForm          : resetForm
  }
})
;app.factory("transactionService", function($http,$resource,$localStorage,Constants) {
  return $resource('/',null,{
    addTransaction:{
       method: 'POST',
       url:"/transaction",
       headers:"application/json"
    },
    getTransaction:{
       method: 'GET',
       url:"/transaction",
       headers:"application/json"
    },
    updateTransaction:{
       method: 'PUT',
       url:"/transaction",
       headers:"application/json"
    },
    getFacilities: {
        method:'GET',
        url:"/facility",
        headers:"application/json"
    },
    getReport: {
        method:'GET',
        url:"/report",
        headers:"application/json"
    }
  });
})
;app.constant("Constants", {
        "storagePrefix": "goAppGh$",
        "getTokenKey" : function() {return this.storagePrefix + "token";},
        "getLoggedIn" : function() {return this.storagePrefix + "loggedin";},
        "availableColor" : "#3955dd",
        "checkedInColor" : "#ff0000",
        "bookedColor" : "yellow",
})
;angular.module('guest_house').directive("transactionDetails",function(){
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/transaction-details.html',
    scope: false,
    // link: link, //DOM manipulation
  };
})
;app.directive("roomFilter",function(){
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/roomFilter.html',
    controller:'RoomFilterController',
    scope:{
      filter:"=",
      modelValue:'='
    },
    link: function(scope, element, attrs) {
      // scope.$watch('modelValue', function(value) {
      //     console.log(value);
      //     scope.modelValue = value;
      // });
    }
  };
})
.controller("RoomFilterController",function($scope,$rootScope,transactionService,GuesthouseService,UtilityService,Util,$timeout) {
  $scope.find = {};
  $scope.room = {};
  $scope.roomFeature = UtilityService.getUserSettings().roomFeature;
  /**
   * functionName : getRoomInfo
   * Info : keeps the data of the current selected transaction and show in the transaction detials
   * input : ...
   * output :...
   * createdDate - 4-9-2016
   * updated on -  4-9-2016 // reason for update
   */
  $scope.getRoomInfo = function(filter){
  // adding facilities selected
  var selectedFacilities = [];
  for(var i in $scope.facilities) {
    if($scope.facilities[i].isChecked)
    {
      selectedFacilities.push($scope.facilities[i]._id);
    }
  }
   var obj = {
     "minPrice" :$scope.find.minPrice,
     "maxPrice" :$scope.find.maxPrice,
     "checkInDate":moment($scope.find.checkInDate).format('MM-DD-YYYY'),
     "roomType":$scope.find.roomType,
     "facilities" : selectedFacilities.toString()
   }
    if(filter=="1"){
      var checked_count = 0;
     GuesthouseService.getRoom(obj,function(response){
      $timeout(function () {
        $scope.modelValue.availableRooms = response.data.availableRooms;
        $scope.modelValue.nonAvailebleRooms = response.data.nonAvailebleRooms;
        console.log($scope.modelValue);
      });
   })
 }
    else if(filter=="2"){
      transactionService.getTransaction(obj,function(response) {
        $scope.filtered_array = [];
        console.log(response);
        // $rootScope.showPreloader = true;
        $scope.modelValue = response.data;
      })
    }
}
/**
 * functionName : allroomLists()
 * Info : keeps the data of the current selected transaction and show in the transaction detials
 * input : ...
 * output :...
 * createdDate - 4-9-2016
 * updated on -  4-9-2016 // reason for update
 */
$scope.allroomLists = function(){
  $rootScope.showPreloader = true;
    var obj = {
      "checkInDate":moment($scope.find.checkInDate).format('MM-DD-YYYY'),
    }
    GuesthouseService.getRoom(obj,function(response){
      // $scope.filtered_array = [];
      $rootScope.showPreloader = false;
      $scope.modelValue.availableRooms = response.data.availableRooms;
      $scope.modelValue.nonAvailebleRooms = response.data.nonAvailebleRooms;
      $scope.find = {};
      $scope.room.roomType = false;
      angular.forEach($scope.facilities,function(item){
        item.isChecked = false;
      })
    })
}
/**
 * functionName : allTransactions()
 * Info : keeps the data of the current selected transaction and show in the transaction detials
 * input : ...
 * output :...
 * createdDate - 4-9-2016
 * updated on -  4-9-2016 // reason for update
 */
  $scope.allTransactions = function(){
    transactionService.getTransaction(function(response) {
      //$rootScope.showPreloader = true;
      // $scope.filtered_array = [];
      $scope.trasactionList = response.data;
      // angular.forEach($scope.trasactionList,function(item){
      //    $scope.filtered_array.push(item);
      // })
      $scope.find = {};
    })
  }
/**
 * functionName : newRoomInit()
 * Info : keeps the data of the current selected transaction and show in the transaction detials
 * input : ...
 * output :...
 * createdDate - 4-9-2016
 * updated on -  4-9-2016 // reason for update
 */
$scope.newRoomInit = function() {
  transactionService.getFacilities(
    function(response){
        if(response.statusCode == 200){
            $scope.facilities = response.data;
        }
        else {
            Util.alertMessage('danger', response.message);
        }
    },
    function(err){
          Util.alertMessage('danger', err.message);
    }
  )
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
;app.directive('dateViewer', function () {
    return {
        require: "ngModel",
        restrict: 'EA',
        templateUrl: 'directives/views/datepick.html',
        controller:'dateViewerController',
        // link : linkfunction,
        scope:{
          ngModel:'=' // ngModel = user.establishDate  = 2
        }
    };
})
.controller("dateViewerController",["$scope",function($scope) {
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
}])
;angular.module('guest_house').directive("reportDetails",function(){
  return {
    restrict: 'EA',
    templateUrl: 'directives/views/report-details.html',
    scope: false
  };
})
;app.filter('dateformat', function(){
  return function(date){
    if(date){
      return moment(date).format("YYYY-MM-DD");
    }
  }
})
;app.directive("roomStyle",function(Constants){
  return {
    restrict: 'A',
    // controller:'RoomStyleController',
    scope:{
      inputObject:'='
    },
    link: function(scope, element, attrs) {
    // console.log("inputObject  ",scope.inputObject.bookingStatus);
     if(scope.inputObject && scope.inputObject.bookingStatus == "AVAILABLE" )
     {
      //  element.css({background: red})
      // console.log("red");
      // element.addClass('custom_roomlist');
      var css = {
        "border" : "2px solid "+Constants.availableColor,
        "color"  : Constants.availableColor,
      }
      var spanCss = {
        "background" : Constants.availableColor
      }
      $(element[0]).find(".room-listing-box").css(css);
      $(element[0]).find(".room-listing-box span").css(spanCss);
     }
     else if(scope.inputObject && scope.inputObject.bookingStatus == "CHECKED-IN"){
         var css = {
           "border" : "2px solid "+Constants.checkedInColor,
           "color"  : Constants.checkedInColor,
         }
         var spanCss = {
           "background" : Constants.checkedInColor
         }
         $(element[0]).find(".room-listing-box").css(css);
         $(element[0]).find(".room-listing-box span").css(spanCss);
     }
     else if(scope.inputObject && scope.inputObject.bookingStatus == "BOOKED"){
         var css = {
           "border" : "2px solid "+Constants.bookedColor,
           "color"  : Constants.bookedColor,
         }
         var spanCss = {
           "background" : Constants.bookedColor
         }
         $(element[0]).find(".room-listing-box").css(css);
         $(element[0]).find(".room-listing-box span").css(spanCss);
     }
    }
  };
})
// .controller("RoomStyleController",["$scope",function($scope) {
//   console.log($scope.availableRooms);
//   if(availableRooms.bookingStatus == 'AVAILABLE'){
//     element.css()
//   }
//
// }])
