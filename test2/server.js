var Conf = require('./Conf')
var express = require('express');
var fs = require('fs');
var app = express();
var pug = require('pug');	//模板引擎
var expressWs = require('express-ws')(app);	//ws
var jwt = require('jwt-simple');	//jwt
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });	//用于post路由
app.use(cookieParser());
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('./'));

//几个变量
var for_WSexample1_users = new Set()    //用于WS实例
var for_WSchatroom_users = new Set()    //用于WS聊天室项目 存储成员的ws
//自定义验证token的中间件，在需要的路由上调用
function check_token(req, res, next) {
	var received_token = req.cookies["access_token"];
	if (received_token){
		try{
			var info = jwt.decode(received_token, Conf.secret_key, false, Conf.encryption_algorithm);
		}catch(err){
			console.log("check token cause error:",err);
			return res.redirect('/login');
		};
		if (!("exp" in info) || info['exp']<Date.now()/1000){	//过期
			res.redirect('/login');
		};
		req.UserInfo = {'id':info['id'],'name':info['name']};
	}else{
		res.redirect('/login');
	};
	next();
};
// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
	console.log('Time:', Date.now(),'url',req.originalUrl,'med',req.method);
	next();
});


app.get('/login', function (req, res) {
	res.clearCookie('access_token');
	res.sendFile( __dirname + '/views/login.html' );
})

app.post('/dologin',urlencodedParser,function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	if (username in Conf.Users && Conf.Users[username].pw==password){	//简易验证,这里的username在数据库(假设有)中对应的是id
		console.log(username,"允许登陆");
		var t_payload = {	//#JWT标准中的载荷，实际有用信息的传输
			"id":username,	//#注意传进来的username是user id
			"name":Conf.Users[username]["name"],	//#用户名称，这才是真正意义的username
			"iat":parseInt(Date.now()/1000),	//#签发时间,自行规定单位是秒，而Date.now()单位毫秒，所以要除以1000
			"exp":parseInt(Date.now()/1000)+Conf.access_token_exp,	//#过期时间
		};
		var t_acess_token = jwt.encode(t_payload,Conf.secret_key,Conf.encryption_algorithm);
		res.cookie('access_token',t_acess_token,{ maxAge: Conf.cookie_exp*1000, httpOnly: true });	//乘以1000同样是秒和毫秒的关系
		console.log(t_acess_token);
		//完成登陆跳转首页
		res.redirect('/index');
	}else{
		res.redirect('/login');
	};
})

app.get('/', function (req, res) {
	console.log('Hello root /!');
	res.redirect('/index');
});

app.get('/index',check_token,function (req, res) {
	res.render('index',{"title":"9touchong",pretty:true,UserInfo:req.UserInfo});
})

app.get('/:agame', check_token, function (req, res) {
	if (fs.existsSync("./views/"+req.params.agame+".pug")){
		res.render(req.params.agame,{pretty:true,Conf:Conf,UserInfo:req.UserInfo});
	}else{
		res.render("normal_one_game",{"game_name":req.params.agame,pretty:true,Conf:Conf,UserInfo:req.UserInfo})
	}
})

app.ws('/forWSexample1',function(ws,req){	//#此路由仅用于WS实例1
	for_WSexample1_users.add(ws);
	ws.on('message', function(msg){
		if (msg){
			console.log("received:",msg);
			for_WSexample1_users.forEach(function(u){
				u.send(msg);
			});
		}else{
			console.log("received none");
		};
	});
	for_WSexample1_user.delete(ws);
})

app.use('/forWSchatroom',check_token);	//经过ws的req结构会改变所以tokencheck这一步不好放在下边
app.ws('/forWSchatroom',function(ws,req){	//#用于聊天室项目通信
	var temVipUsers= new Set(["0001","0003"]);	//假设这两个id有权限进入聊天室
	if (!for_WSchatroom_users.has(ws)){	//不是已在聊天室内的ws连接
		console.log("进入forWSchatroom");
		if (req.UserInfo && temVipUsers.has(req.UserInfo["id"])){//有权限的用户
			for_WSchatroom_users.add(ws);
			console.log("用户id",req.UserInfo["id"],"将被允许进入");
		}else{	//用户无权限
			//ws.send("对不起您无进入权限");
			console.log("用户id",req.UserInfo["id"],"因无权限被禁入聊天室");
		};
	}
	//下面就是合法成员正常传送消息的情况了
	console.log("将与",req.UserInfo["id"],"通信");
	ws.on('message', function(msg){
		if (msg){
			d_msg=JSON.parse(msg);
			s_msg=JSON.stringify(d_msg);
			msg=s_msg;	//这里象征性的处理一下，结果和接收到的一样
			for_WSchatroom_users.forEach(function(u){
				u.send(msg);
			});
		};
	});
});

// 一个中间件栈，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
	// 如果 user id 为 0, 跳到下一个路由
	if (req.params.id == 0) next('route');
	// 否则将控制权交给栈中下一个中间件
	else next(); //
}, function (req, res, next) {
	// 渲染常规页面
	res.send('regular');
});

// 处理 /user/:id， 渲染一个特殊页面
app.get('/useru/:id', function (req, res, next) {
	res.send('special');
});

var server = app.listen(Conf.localport,Conf.localhost,function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('9tc app listening at http://%s:%s', host, port);
});
