var mongoose = require('mongoose');
//mongoose.connect('mongodb://123.57.143.189/zhufengchat');
mongoose.connect('mongodb://localhost/zhufengchat');
exports.User = mongoose.model('User',require('./user'));
exports.Room = mongoose.model('Room',require('./room'));