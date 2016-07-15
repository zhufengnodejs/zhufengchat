angular.module('zhufengChat').controller('RoomCtrl',['$scope','$http','$location','$routeParams','socket','$rootScope',function($scope,$http,$location,$routeParams,socket,$rootScope){
    var roomId = $routeParams.roomId;
    socket.emit('join',{roomId:roomId,user:$rootScope.user});
    $scope.newMessage = '';
    $scope.room = {};
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
        if($scope.room)
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
        if($scope.room)
        $scope.$apply(function(){
            $scope.room.users = $scope.room.users.filter(function(item){
                return item._id != user._id;
            });
        });
    });
}]);