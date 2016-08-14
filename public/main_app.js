app = angular.module("guest_house", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate']);
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

  var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope, $state, UserService) {

      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/user/loggedin').success(function (response) {

          var user = response.user;
          if (response.status == 'OK' && user.role.type) {
              $state.go(user.role.type+".dashboard");
          }
          else {
              $timeout(function () {
                  deferred.resolve();
              }, 0);
              $state.go('signIn');
          }
      });
      return deferred.promise;
  };
  var checkLoggedout = function ($q, $timeout, $http, $location, $rootScope, $state, UserService) {
      var deferred = $q.defer();
      $http.get('/user/loggedin').success(function (response) {
          console.log("user checkLoggedout  >>>>>>>>>>>>>>>   ", response);
          if (response.status == 'OK' && user.role.type) {
              $timeout(deferred.resolve, 0);
          }
          else {
              $timeout(function () {
                  deferred.resolve();
              }, 0);
              $state.go('signIn');
          }
      });
      return deferred.promise;
  };
    $urlRouterProvider.otherwise('/signIn');
    $stateProvider
        .state('signIn', {
            templateUrl: 'src/views/commons/signIn.html',
            url: '/signIn',
            controller:"SignInController",
            // resolve: {loggedin: checkLoggedin}
        })
        .state("ccare", {
                abstract: true,
                url: "",
                views: {
                    'header': {
                        templateUrl: 'src/views/ccare/header.html',
                        controller: "MainController"
                    },
                    'sidebar': {
                        templateUrl: 'src/views/ccare/sidebar.html',
                        controller: "MainController"
                    },
                    '': {
                        templateUrl: ''
                    }
                },
            })
            .state('ccare.dashboard', {
                // url will become '/contacts/list'
                url: '/dashboard',
                templateUrl: 'src/views/ccare/dashboard.html',
                // controller: "mapController",
                // resolve: {loggedin: checkLoggedout},

            })
});
