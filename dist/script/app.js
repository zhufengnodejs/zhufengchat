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

angular.module('zhufengChat').controller('LoginCtrl',['$scope','$http','$location',function($scope,$http,$location){
    $scope.login = function(){
        $http({
            url:'/user/login',
            method:'POST',
            data:{email:$scope.email}
        }).success(function(user){
            $scope.$emit('login', user);
            $location.path('/rooms');
        }).error(function(data){
            console.error(data);
            $location.path('/login');
        });
    }
}]);
angular.module('zhufengChat').controller('RoomsCtrl',['$scope','$http','$location',function($scope,$http,$location){
    $scope.rooms = $scope._rooms = [];

    $http({
        url:'/room/list',
        method:'get'
    }).success(function(rooms){
        $scope.rooms = $scope._rooms = rooms;
    }).error(function(result){
        console.error(result);
    })

    $scope.filter = function(){
        $scope.rooms = $scope._rooms.filter(function(room){
            return room.name.indexOf($scope.keyword)!=-1;
        });
    }
    $scope.createRoom = function(){
        $http({
            url:'/room/add',
            method:'POST',
            data:{name:$scope.keyword}
        }).success(function(room){
            $scope._rooms.push(room);
            $scope.filter();
        }).error(function(result){

        });
    }

    $scope.join = function(roomId){
        $location.path("/rooms/"+roomId);
    }
}]);
angular.module('zhufengChat').controller('RoomCtrl',['$scope','$http','$location','$routeParams','socket','$rootScope',function($scope,$http,$location,$routeParams,socket,$rootScope){
    var roomId = $routeParams.roomId;
    socket.emit('join',{roomId:roomId,user:$rootScope.user});
    $scope.newMessage = '';
    $http({
        url:'/room/detail/'+roomId,
        method:'post',
        data:{user: $rootScope.user._id}
    }).success(function(room){
        $scope.room = room;
    }).error(function(result){
        console.error(result);
    });

    $scope.createMessage = function(){
        if($scope.content){
            socket.emit('createMessage',{
                roomId:roomId,
                content: $scope.content,
                user: $rootScope.user,
                createAt: Date.now()
            });
            $scope.content = '';
        }
    }

    socket.on('messageCreated',function(msg){
        $scope.$apply(function(){
            $scope.room.messages.push(msg);
        });
    });

    socket.on('userAdded',function(user){
        $scope.$apply(function(){
            var index = $scope.room.users.findIndex(function(item){
                return item._id == user._id;
            });
            if(index==-1)
              $scope.room.users.push(user);
        });
    });

    socket.on('userDeleted',function(user){
        $scope.$apply(function(){
            $scope.room.users = $scope.room.users.filter(function(item){
                return item._id != user._id;
            });
        });
    });
}]);
angular.module('zhufengChat').directive('ctrlEnterBreakLine', function () {
    return {
        link: function (scope, element, attrs) {
            var ctrlDown = false;
            element.bind('keydown', function (event) {
                if (event.which == 17) {
                    ctrlDown = true;
                    setTimeout(function () {
                        ctrlDown = false;
                    }, 1000)
                }
                if (event.which == 13) {
                    if (ctrlDown) {
                        element.val(element.val() + '\n');
                    } else {
                        scope.$apply(function () {
                            scope.$eval(attrs.ctrlEnterBreakLine);
                        });
                        event.preventDefault();
                    }
                }
            });
        }
    }
})
angular.module('zhufengChat').factory('socket',function(){
    var socket = io.connect('/');
    return {
        on:function(event,listener){
            socket.on(event,listener);
        },
        emit:function(event,data){
            socket.emit(event,data);
        }
    }
})