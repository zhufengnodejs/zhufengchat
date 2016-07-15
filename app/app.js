angular.module('zhufengChat', ['ngRoute']).config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
    $routeProvider.when('/',{
        templateUrl:'/pages/login.html',
        controller:'LoginCtrl'
    }).when('/rooms',{
        templateUrl:'/pages/rooms.html',
        controller:'RoomsCtrl'
    }).otherwise({
        redirectTo:'/'
    });
}]).run(['$rootScope',function($rootScope){
    $rootScope.$on('login',function(event,user){
        $rootScope.user = user;
    });
}]);
