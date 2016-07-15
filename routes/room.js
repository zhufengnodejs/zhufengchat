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

//查看房间的详情
router.post('/detail/:roomId',function(req,res){
    var data = req.body;
    models.Room.findById(req.params.roomId,function(err,room){
        if(err){
            res.statusCode(500).send('查询失败!');
        }else{
            var index = room.users.findIndex(function(user){
                return user == data.user;
            });
            if(index == -1){
                room.users.push(data.user);
                room.save(function(err,doc){
                    models.Room.findById(doc._id).populate('users').populate('messages.user').exec(function(err,doc){
                        res.send(doc);
                    });

                });
            }else{
                models.Room.findById(req.params.roomId).populate('users').populate('messages.user').exec(function(err,doc){
                    res.send(doc);
                });
            }

        }
    });
});
module.exports = router;