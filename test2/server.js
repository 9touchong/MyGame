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
// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
	console.log('Time:', Date.now(),'url',req.originalUrl,'med',req.method);
	//check token
	var recrived_token = req.cookies["access_token"];
	if (recrived_token){
		var info = jwt.decode(recrived_token, Conf.secret_key, false, Conf.encryption_algorithm);
		if (!("exp" in info) || info['exp']<Date.now()/1000){	//过期
			res.redirect('/login');
		};
		req.UserInfo = {'id':info['id'],'name':info['name']};
	}else{
		res.redirect('/login');
	};
	next();
});

app.get('/', function (req, res) {
	console.log('Hello root /!');
	console.log('Hello root',req.recrived_token);
	res.redirect('/index');
});

app.get('/login', function (req, res) {
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

app.get('/index', function (req, res) {
	res.render('index',{"title":"9touchong",pretty:true,UserInfo:req.UserInfo});
})

app.get('/:agame', function (req, res) {
	if (fs.existsSync("./views/"+req.params.agame+".pug")){
		res.render(req.params.agame,{pretty:true,Conf:Conf});
	}else{
		res.render("normal_one_game",{"game_name":req.params.agame,pretty:true,Conf:Conf})
	}
})

app.ws('/forWSexample1',function(ws,req){
	for_WSexample1_users.add(ws);
	ws.on('message', function(msg){
		if (msg){
			console.log("received:",msg);
			for_WSexample1_users.forEach(function(u){
				u.send(msg);
			});
		}else{
			console.log("received none");
		}
	});
	for_WSexample1_user.delete(ws);
})


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
