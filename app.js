var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var user = require('./routes/user');
var room = require('./routes/room');
var app = express();

app.use(express.static(path.join(__dirname,'app')));
app.use(express.static(path.join(__dirname,'public')));
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