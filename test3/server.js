var Conf = require('./Conf')
var express = require('express');
var fs = require('fs');
var app = express();
//var pug = require('pug');	//模板引擎
var expressWs = require('express-ws')(app);	//ws
var jwt = require('jwt-simple');	//jwt
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Chess = require('./ChessLogic/chesslogic');	//游戏
var urlencodedParser = bodyParser.urlencoded({ extended: false });	//用于post路由
app.use(cookieParser());
//app.use(express.static('./'));
app.use(express.static('./ChineseChess_client/'));

//几个变量
var game_room = new Set();	//注意 目前简化处理，就允许一个房间，两个玩家，不考虑掉线，网速等等任何情况
var chessgame;	//

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
	res.sendFile( __dirname + '/login.html' );
});

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
});

app.get('/', function (req, res) {
	console.log('Hello root /!');
	res.redirect('/index');
});

app.get('/index',check_token,function (req, res) {
	console.log("will index");
	res.sendFile( __dirname + '/ChineseChess_client/index.html');
});

//app.use('/forChinessChess',check_token);
app.ws('/forChinessChess',function(ws,req){
	console.log("服务器/forChinessChess 收到连接请求");
	ws.on("message",function(msg){
		if (!msg){
			return 0;
		};
		d_msg=JSON.parse(msg);
		console.log("服务器/forChinessChess 收到消息",d_msg);
		if (d_msg.join){	//客户端请求加入游戏,客户端每次连此ws路由，connect时都会发送join
			if (game_room.size<2){	//游戏成员未满
				if (!game_room.has(ws)){	//不是已存在的，避免重复加入
					game_room.add(ws);
					console.log("一个玩家加入了");
					if (game_room.size == 2){
						console.log("两个人够了 可以开游戏了");
						let it = game_room.keys();	//依次取出set的乘员又不一次就不想array一样方便
						chessgame = new Chess.chesslogic(it.next().value,it.next().value);
					}
				}
			}
		}else{
			chessgame.reply_action(d_msg)
		};
	});
	ws.on("close",function(){
		console.log("服务器/forChinessChess 一个连接被关闭了");
	});
	ws.send(JSON.stringify({"resp":true}));
})
var server = app.listen(Conf.localport,Conf.localhost,function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('9tc app listening at http://%s:%s', host, port);
});
