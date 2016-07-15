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