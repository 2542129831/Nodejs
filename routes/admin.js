var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var path = require('path')

//管理用户界面
router.get('/user',function(req,res,next){
    res.render('user')
  })

module.exports = router;