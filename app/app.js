angular.module('zhufengChat', ['ngRoute']).config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
    $routeProvider.when('/',{
        templateUrl:'/pages/login.html',
        controller:'LoginCtrl'
    }).when('/rooms',{
        templateUrl:'/pages/rooms.html',
        controller:'RoomsCtrl'
    }).when('/rooms/:roomId',{
        templateUrl:'/pages/room.html',
        controller:'RoomCtrl'
    }).otherwise({
        redirectTo:'/'
    });
}]).run(['$rootScope','$location',function($rootScope,$location){
    if(!$rootScope.user){
        $location.path('/login');
    }
    $rootScope.$on('login',function(event,user){
        $rootScope.user = user;
    });
}]);
