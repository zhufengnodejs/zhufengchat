var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var user = require('./routes/user');
var room = require('./routes/room');
var app = express();
var models = require('./models');
app.use(express.static(path.join(__dirname,'app')));
app.use(express.static(path.join(__dirname,'public')));
//app.use(express.static(path.join(__dirname,'dist')));
app.get('/',function(req,res){
    res.sendFile(path.resolve('./app/index.html'));
});
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret:'zfpx',
    resave:true,
    saveUninitialized:true
}));
app.use('/user',user);
app.use('/room',room);
var server = app.listen(9090);
var io = require('socket.io').listen(server);
io.on('connection',function(socket){
    var currentRoom;
    var currentUser;
    socket.on('join',function(join){
        socket.join(join.roomId);
        currentRoom = join.roomId;
        currentUser = join.user;
        io.in(currentRoom).emit('messageCreated',{
            createAt:Date.now(),
            content:currentUser.email+'加入此房间',
            user:{email:'系统',avatar:'https://secure.gravatar.com/avatar/9e2fb7db3a1de9906732a4be6a5cd701?s=48'}
        });
        io.in(currentRoom).emit('userAdded',currentUser);
    });

    socket.on('createMessage',function(message){
        var roomId = message.roomId;
        models.Room.findById(roomId,function(err,room){
            var saveMsg = Object.assign({},message);
            saveMsg.user = saveMsg.user._id;
            room.messages.push(saveMsg);
            room.save(function(err,doc){
                io.in(roomId).emit('messageCreated',message);
            });
        })

    });
    socket.on('disconnect',function(){
        if(currentRoom && currentUser)
        models.Room.findById(currentRoom,function(err,room){
            var index = room.users.findIndex(function(user){
                return user == currentUser._id;
            });
            room.users.splice(index,1);
            room.save(function(err,result){
                io.in(currentRoom).emit('messageCreated',{
                    createAt:Date.now(),
                    content:currentUser.email+'已经离开了此房间',
                    user:{email:'系统',avatar:'https://secure.gravatar.com/avatar/9e2fb7db3a1de9906732a4be6a5cd701?s=48'}
                });
                io.in(currentRoom).emit('userDeleted',currentUser);
            });
        })
    });

});
