var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Room = new Schema({
    name:{type:String,isRequired:true},
    users: [{type:ObjectId,ref:'User'}],
    messages:[{
        user:{type:ObjectId,ref:'User'},
        content:String,
        createAt:{type:Date,default:Date.now()}
    }]
});

module.exports = Room;