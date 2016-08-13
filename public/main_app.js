var app = angular.module("guest_house", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate']);
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('login', {
            templateUrl: 'src/views/commons/login.html',
            url: '/login',
            controller:function($scope) {
              console.log("login controller");
            }

        })

});
app.controller("MainController",function($scope,$rootScope) {
  console.log("main controller");
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
  // $dialogs.error("Something went wrong!", error);
  console.error("$stateChangeError: ", toState, error);
});
})
