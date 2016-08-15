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

          // var user = response.user;
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
  function checkLoggedout ($q, $timeout, $http, $location, $rootScope, $state,$localStorage) {
      var deferred = $q.defer();
      $http.get('/user/loggedin').success(function (response) {
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

        .state('signIn', {
            templateUrl: 'pages/signIn.html',
            url: '/signIn',
            controller:"SignInController",
            resolve: {loggedin: checkLoggedin},

        })

});
