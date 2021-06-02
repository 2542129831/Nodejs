var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5-node');//md5加密


let connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  port:'3306',
  password:'2542129831',
  database:'blog'
});

//登录页面
router.get('/',function(req,res){
  res.render('login')
});
//登录失败页面
router.get('/login_has_failed',function(req,res){
  res.render('login_has_failed')
});
//注册页面
router.get('/register',function(req,res){
  res.render('register')
});
//注册失败页面
router.get('/register_has_failed',function(req,res){
  res.render('register_has_failed')
});
//注册成功页面
router.get('/register_has_true',function(req,res){
  res.render('register_has_true')
});

//后台博客管理
router.get('/blogs',function(req,res){
  connection.query("select * from blog",function(err,results,fields){
    var datastring = JSON.stringify(results);
    var data = JSON.parse(datastring);
    console.log('result:',data);
    res.render('blogs',{"sqldata":data});
  });
});
//后台新增博文
router.get('/blogs-input',function(req,res){
  res.render('blogs-input');
});
//后台博文信息删除
router.get('/delete_blog:id',(req,res) => {
  connection.query("delete from blog where id ='"+req.params.id+"'",function(err,results,fields){
    connection.query("select * from blog",function(err,results,fields){
      var datastring = JSON.stringify(results);
      var data = JSON.parse(datastring);
      console.log('result:',data);
      res.render('blogs',{"sqldata":data});
    });
  });
});
//后台博文信息更改
router.get('/update_blog:id',(req,res) => {
  connection.query("select * from blog where id ='"+req.params.id+"'",function(err,results){
    if(err){
      console.log("err",err)
    }
    var data = {
      "id":results[0].id,
      "type":results[0].type,
      "title":results[0].title,
      "description":results[0].description,
      "content":results[0].content,
      "image":results[0].image
    }
    console.log('result:',data);
    res.render('blog_update',{"data":data});
  });
});
//后台博文信息编辑表单
router.post("/update_blog:id",(req,res) => {
  connection.query("update blog set type = '"+req.body.type+"',title = '"+req.body.title+"',description = '"+req.body.description+"',content = '"+req.body.content+"',image = '"+req.body.image+"',update_time = '"+(new Date()).Format("yyyy-MM-dd hh:mm:ss")+"' where id='"+req.params.id+"'",function(err,results){
    if(err){
      console.log("err",err)
    } 
    console.log(results);
    connection.query("select * from blog",function(err,results){
    var datastring = JSON.stringify(results);
    var data = JSON.parse(datastring);
    console.log('result:',data);
    res.render('blogs',{"sqldata":data});
  });
  });
});
//博文新增失败
router.get('/blog_input_failed.html',function(req,res,next){
  res.render('blog_input_failed.html');
});
//后台博文新增表单
router.post('/blogs-input',function(req,res,next){
  connection.query("insert into blog(type,title,description,content,time_stamp) value(?,?,?,?,?)",[req.body.type,req.body.title,req.body.description,req.body.content,(new Date()).Format("yyyy-MM-dd hh:mm:ss")],function (err, results) {
    console.log(err)
    console.log(results)
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      res.render("0");//如果发布失败就给客户端返回0
      return;//如果失败了就直接return不会继续下面的代码
    }
    connection.query("select * from blog",function(err,results){
      var datastring = JSON.stringify(results);
      var data = JSON.parse(datastring);
      console.log('result:',data);
      res.render('blogs',{"sqldata":data});
    });//如果发布成功就给客户端返回后台博文管理页面
});
});

//后台用户管理
router.get('/user',function(req,res){
  connection.query("select * from member",function(err,results){
    var datastring = JSON.stringify(results);
    var data = JSON.parse(datastring);
    console.log('result:',data);
    res.render('user',{"sqldata":data})
  });
});
//后台用户信息删除
router.get('/delete_user:id',(req,res) => {
  connection.query("delete from member where id ='"+req.params.id+"'",function(err,results,fields){
    connection.query("select * from member",function(err,results,fields){
      var datastring = JSON.stringify(results);
      var data = JSON.parse(datastring);
      console.log('result:',data);
      res.render('user',{"sqldata":data});
    });
  });
});
//后台用户信息更改
router.get('/update_user:id',(req,res) => {
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
router.post("/update_user:id",(req,res) => {
  connection.query("select * from member where id ="+req.params.id,function(err,result){
      if(result[0].password == md5(req.body.password) || result[0].password == req.body.password){
        let selectSQL = "select phone_number from member where phone_number = '"+req.body.phone_number+"' AND id!='"+req.params.id+"'";
    connection.query(selectSQL,function (err, result) {
      console.log(result)
      if(err){
        res.render('user_update_failed');
      return;
      }
        if(result==''){
          connection.query("update member set name = '"+req.body.name+"',phone_number = '"+req.body.phone_number+"',type = '"+req.body.type+"' where id='"+req.params.id+"'",function(err,results){
            if(err){
              console.log("err",err);
              res.render('user_update_failed');
            } 
            console.log(results);
            connection.query("select * from member",function(err,results){
              var datastring = JSON.stringify(results);
              var data = JSON.parse(datastring);
              console.log('result:',data);
              res.render('user',{"sqldata":data});
            });
          });
        }else{
          res.render('user_update_failed');
        }
    });
    }else{
      let selectSQL = "select phone_number from member where phone_number = '"+req.body.phone_number+"' AND id!='"+req.params.id+"'";
      connection.query(selectSQL,function (err, result) {
        console.log(result)
        if(err){
          res.render('user_update_failed');
        return;
        }
          if(result==''){
            connection.query("update member set name = '"+req.body.name+"',phone_number = '"+req.body.phone_number+"',password = '"+md5(req.body.password)+"',type = '"+req.body.type+"' where id='"+req.params.id+"'",function(err,results){
              if(err){
                console.log("err",err);
                res.render('user_update_failed');
              } 
              console.log(results);
              connection.query("select * from member",function(err,results){
                var datastring = JSON.stringify(results);
                var data = JSON.parse(datastring);
                console.log('result:',data);
                res.render('user',{"sqldata":data});
              });
            });
          }else{
            res.render('user_update_failed');
          }
      });
    }
  });
});
//后台用户信息编辑失败页面
router.get('/user_update_failed',function(req,res){
  res.render('user_update_failed')
});

//前台首页
router.get('/index:id',function(req,res,next){
      let id = req.params.id;
      connection.query("select * from blog ",function(err,result){
        console.log(result);
        let datastring = JSON.stringify(result);
          var data = JSON.parse(datastring);
        res.render('index',{
          "data":data,
          "id":id
        });
      });
});

//美食博文列表页面
router.get('/food:id',function(req,res,next){
  let id = req.params.id;
  connection.query("select * from blog where type = '美食'",function(err,result){
    console.log(result);
    let datastring = JSON.stringify(result);
      var data = JSON.parse(datastring);
    res.render('food',{
      "data":data,
      "id":id
    });
  });
});

//动漫博文列表页面
router.get('/animation:id',function(req,res,next){
  let id = req.params.id;
  connection.query("select * from blog where type = '动漫'",function(err,result){
    console.log(result);
    let datastring = JSON.stringify(result);
      var data = JSON.parse(datastring);
    res.render('animation',{
      "data":data,
      "id":id
    });
  });
});

//编程博文列表页面
router.get('/program:id',function(req,res,next){
  let id = req.params.id;
  connection.query("select * from blog where type = '技术'",function(err,result){
    console.log(result);
    let datastring = JSON.stringify(result);
    var data = JSON.parse(datastring);
    res.render('program',{
      "data":data,
      "id":id
    });
  });
});

//博文详情页面
router.get('/blog:blogid:userid',function(req,res){
  connection.query("select * from blog where id ='"+req.params.blogid+"'",function(err,result){
    let datastring = JSON.stringify(result);
    var data = JSON.parse(datastring);
    connection.query("update blog set views = '"+(result[0].views+1)+"' where id ='"+req.params.blogid+"'",function(err,result){
    });
    res.render('blog',{
      "data":data,
      "blogid":req.params.blogid,
      "userid":req.params.userid
    });
  });
});

//前台个人信息
router.get('/about:id',function(req,res){
  let id = req.params.id;
  connection.query("select * from member where id ='"+req.params.id+"'",function(err,result){
    let data1 = {
      "id":result[0].id,
      "name":result[0].name,
      "naphone_numberme":result[0].phone_number,
      "time_stamp":result[0].time_stamp
    }
    let datastring = JSON.stringify(data1);
      var data = JSON.parse(datastring);
    res.render('about',{
      "data":data,
      "id":id
    });
  });
});

//登录表单提交
router.get('/login',function(req,res){
let selectSQL = "select id,phone_number,password,type from member where phone_number = '"+req.query.phone_number+"' and password = '"+md5(req.query.password)+"'";
   connection.query(selectSQL,function (err, result) {
     console.log(result)
     if(err){
      console.log('[login ERROR] - ',err.message);
      return;
     }
     if(result==''){
         res.render('login_has_failed')
     }
     else if(result[0].type=="user"){//用户跳转到首页
      let id = result[0].id;
      connection.query("select * from blog ",function(err,result){
        console.log(result);
        let datastring = JSON.stringify(result);
          var data = JSON.parse(datastring);
        res.render('index',{
          "data":data,
          "id":id
        });
      });
     }else if(result[0].type=="admin"){//管理员跳转到后台管理
      console.log(result[0].type)
      console.log("OK");
      connection.query("select * from blog",function(err,results){
        var datastring = JSON.stringify(results);
        var data = JSON.parse(datastring);
        console.log('result:',data);
        res.render('blogs',{"sqldata":data});
      });
     };
    });
});
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
      console.log((new Date()).Format("yyyy-MM-dd hh:mm:ss"));
      connection.query("insert into member(name,phone_number,password,type,time_stamp) value(?,?,?,?,?)",[req.query.name,req.query.phone_number,md5(req.query.password),"user",(new Date()).Format("yyyy-MM-dd hh:mm:ss")],function (err, results) {
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
        res.render('register_has_failed');//注册失败返回注册失败页面
    }
   });
  }else{
    res.render('register_has_failed');
  }
});




module.exports = router;
