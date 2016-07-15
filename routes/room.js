var express = require('express');
var models = require('../models');
var util = require('../util');
var router = express.Router();
router.post('/add',function(req,res){
   var room = req.body;
   room.users = room.messages = [];
   models.Room.findOne(room,function(err,doc){
        if(doc){
            res.send(doc);
        }else{
            models.Room.create(room,function(err,doc){
                res.send(doc);
            });
        }
   })
});

router.get('/list',function(req,res){
    models.Room.find({},function(err,rooms){
        if(err){
            res.statusCode(500).send('查询失败!');
        }else{
            res.send(rooms);
        }
    });
});
module.exports = router;