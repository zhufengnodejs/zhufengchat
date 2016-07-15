angular.module('zhufengChat').controller('RoomsCtrl',['$scope','$http','$location',function($scope,$http,$location){
    $scope.rooms = $scope._rooms = [];

    $http({
        url:'/room/list',
        method:'get'
    }).success(function(rooms){
        $scope.rooms = $scope._rooms = rooms;
    }).error(function(){

    })

    //根据关键字进行过滤
    $scope.filter = function(){
        $scope.rooms = $scope._rooms.filter(function(room){
            return room.name.indexOf($scope.keyword)!=-1;
        });
    }
    //创建房间
    $scope.createRoom = function(){
        $http({
            url:'/room/add',
            method:'POST',
            data:{name:$scope.keyword}
        }).success(function(room){
            console.log(room);
            $scope._rooms.push(room);
            $scope.filter();
        }).error(function(result){

        });
    }
}]);