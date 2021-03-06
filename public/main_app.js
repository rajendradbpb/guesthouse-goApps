app = angular.module("guest_house", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate','datePicker','ngCookies','ngStorage']);
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
                  switch (response.user.role.type) {
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
        .state('room_lists',{
            templateUrl: 'pages/roomLists.html',
            url: '/room_lists?checkInDate=&isDash=&status',
            controller:'roomController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('room_Details',{
            templateUrl: 'pages/roomDetails.html',
            url: '/room_Details',
            controller:'roomController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('BookingDetails',{
            templateUrl: 'pages/bookingDetails.html',
            url: '/BookingDetails',
            controller:'BookingController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('allTransactions',{
            templateUrl: 'pages/Transactions/transactions.html',
            url: '/allTransactions',
            controller:'newTransactionController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('transactionDetails',{
            templateUrl: 'pages/Transactions/transactionDetails.html',
            url: '/transactionDetails',
            controller:'newTransactionController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('checkout',{
            templateUrl: 'pages/checkoutPage.html',
            url: '/checkout',
            controller:'newTransactionController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('roomList_details',{
            templateUrl: 'pages/roomLists.html',
            url: '/roomList_details?checkInDate=&isDash=&status',
            // url: '/transaction_details',
            params: {
               obj: null
            },
            controller:'newTransactionController',
            resolve: {loggedin: checkLoggedout},
        })
        // .state('transaction_Report',{
        //     templateUrl: 'pages/transaction/transaction_report.html',
        //     url: '/transaction_Report',
        //     controller:'transactionController',
        //     resolve: {loggedin: checkLoggedout},
        // })
        .state('print_bill',{
            templateUrl: 'pages/printinvoice.html',
            url: '/print_bill',
            controller:'transactionController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('transaction_Report',{
            templateUrl: 'pages/Report/TransactionReport.html',
            url: '/transaction_Report',
            controller:'reportController',
            resolve: {loggedin: checkLoggedout},
        })
        .state('report_Details',{
            templateUrl: 'pages/Report/ReportDetails.html',
            url: '/report_Details',
            controller:'reportController',
            resolve: {loggedin: checkLoggedout},
        })

});
app.factory('Util', ['$rootScope',  '$timeout' , function( $rootScope, $timeout){
    var Util = {};
    $rootScope.alerts =[];
    Util.alertMessage = function(msgType, message){
        if(msgType == "failed")
          msgType = "warning";
        var alert = { type:msgType , msg: message };
        $rootScope.alerts.push( alert );
         $timeout(function(){
            $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
         }, 5000);
    };
    return Util;
  }]);
