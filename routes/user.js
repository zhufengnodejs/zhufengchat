var express = require('express');
var models = require('../models');
var util = require('../util');
var router = express.Router();
router.use('/login',function(req,res){
   var user = req.body;
   models.User.findOne({email:user.email},function(err,doc){
      if(err){
        res.statusCode(500).send('登陆失败');
      }else{
          if(doc){
              req.session.user = doc;
              res.send(doc);
          }else{
              user.avatar="https://secure.gravatar.com/avatar/"+util.md5(user.email)+"?s=48";
              models.User.create(user,function(err,user){
                  req.session.user = user;
                  res.send(user);
              })
          }
      }
   })
});
module.exports = router;