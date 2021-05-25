var express = require('express');
var router = express.Router();
var mysql = require('mysql');

let connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  port:'3306',
  password:'2542129831',
  database:'blog'
})
connection.query("select * from member",function(err,results,fields){
  console.log(err)
  console.log(results)
  console.log(fields)
})

//登录页面
router.get('/',function(req,res,next){
  res.render('login')
})
//登录失败页面
router.get('/login_has_failed',function(req,res,next){
  res.render('login_has_failed')
})
//注册页面
router.get('/register',function(req,res,next){
  res.render('register')
})
//注册失败页面
router.get('/register_has_failed',function(req,res,next){
  res.render('register_has_failed')
})
//注册成功页面
router.get('/register_has_true',function(req,res,next){
  res.render('register_has_true')
})
//后台博客管理
router.get('/blogs',function(req,res,next){
  res.render('blogs')
})
//后台用户管理
router.get('/user',function(req,res,next){
  connection.query("select * from member",function(err,results,fields){
    var datastring = JSON.stringify(results);
    var data = JSON.parse(datastring);
    console.log('result:',data);
    res.render('user',{"sqldata":data})
  })
})
//后台用户信息删除
router.get('/delete:id',(req,res) => {
  connection.query("delete from member where id ='"+req.params.id+"'",function(err,results,fields){
    connection.query("select * from member",function(err,results,fields){
      var datastring = JSON.stringify(results);
      var data = JSON.parse(datastring);
      console.log('result:',data);
      res.render('user',{"sqldata":data})
    })
  })
});
//后台用户信息更改
router.get('/update:id',(req,res) => {
  connection.query("select * from member where id ='"+req.params.id+"'",function(err,results){
    if(err){
      console.log("err",err)
    }
    var data = {
      "id":results[0].id,
      "name":results[0].name,
      "phone_number":results[0].phone_number,
      "password":results[0].password,
      "type":results[0].type
    }
    console.log('result:',data);
    res.render('user_update',{"data":data});
  });
});
//后台用户信息编辑表单
router.post("/update",(req,res) => {
  connection.query("update member set name = '"+req.body.name+"',phone_number = '"+req.body.phone_number+"',password = '"+req.body.password+"',type = '"+req.body.type+"' where phone_number='"+req.body.phone_number+"'",function(err,results){
    if(err){
      console.log("err",err)
    }
    console.log(results);
    connection.query("select * from member",function(err,results,fields){
      var datastring = JSON.stringify(results);
      var data = JSON.parse(datastring);
      console.log('result:',data);
      res.render('user',{"sqldata":data})
    });
  });
});
//新增博文
router.get('/blogs-input',function(req,res,next){
  res.render('blogs-input')
})
//跳转到个人页面
router.get('/about:id',function(req,res,next){
  let selectSQL = "select * from member where id = '"+id+"'";
  connection.query(selectSQL,function (err, result) {
    let personal = {
      "name":result[0].name,
      "naphone_numberme":result[0].phone_number,
      "head_portrait":result[0].head_portrait,
      "time_stamp":result[0].time_stamp,
    }
    res.render('about',personal)
  });
})
//登录表单提交
router.get('/login',function(req,res,next){
  let response = {
    "phone_number":req.query.phone_number,
    "password":req.query.password,
  };
let selectSQL = "select id,phone_number,password,type from member where phone_number = '"+req.query.phone_number+"' and password = '"+req.query.password+"'";
   connection.query(selectSQL,function (err, result) {
     console.log(result)
     if(err){
      console.log('[login ERROR] - ',err.message);
      return;
     }
     if(result==''){
         res.render('login_has_failed')
     }
     else if(result[0].type=="user"){
         console.log(result[0].type)
         console.log("OK");
         res.render('index',{"id":result[0].id})//跳转到首页
     }else if(result[0].type=="admin"){
      console.log(result[0].type)
      console.log("OK");
      res.render('blogs')//跳转到后台管理
     }
    });
console.log(response);
})
Date.prototype.Format = function(fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//注册表单提交
router.get('/process_get',function(req,res,next){
  if(req.query.password==req.query.repassword){
  let selectSQL = "select phone_number from member where phone_number = '"+req.query.phone_number+"'";
  connection.query(selectSQL,function (err, result) {
    console.log(result)
    if(err){
     console.log('[login ERROR] - ',err.message);
     return;
    }
    if(result==''){
      var response = {
        "name":req.query.name,
        "phone_number":req.query.phone_number,
        "password":req.query.password,
      };
      console.log(response);
      console.log((new Date()).Format("yyyy-MM-dd hh:mm:ss"));
      connection.query("insert into member(name,phone_number,password,type,time_stamp) value(?,?,?,?,?)",[req.query.name,req.query.phone_number,req.query.password,"user",(new Date()).Format("yyyy-MM-dd hh:mm:ss")],function (err, results) {
          console.log(err)
          console.log(results)
          if(err){
            console.log('[INSERT ERROR] - ',err.message);
            res.end("0");//如果注册失败就给客户端返回0
            return;//如果失败了就直接return不会继续下面的代码
          }
          res.render("register_has_true");//如果注册成功就给客户端返回注册成功页面
      });
    }
    else{
        res.render('register_has_failed')//注册失败返回注册失败页面
    }
   });
  }else{
    res.render('register_has_failed')
  }
})

module.exports = router;
