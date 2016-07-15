var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = new Schema({
    email:{type:String,isRequired:true},
    avatar: {type:String,isRequired:true}
});

module.exports = User;