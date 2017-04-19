var express = require('express');
var fs = require('fs');
var app = express();
var pug = require('pug');	//模板引擎
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('./'));

// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
	console.log('Time:', Date.now(),'url',req.originalUrl,'med',req.method);
	next();
});

app.get('/', function (req, res) {
	console.log('Hello root /!');
	res.redirect('/index');
});

app.get('/login', function (req, res) {
	res.sendFile( __dirname + '/views/login.html' );
})

app.get('/index', function (req, res) {
	res.render('index',{"title":"9touchong",pretty:true});
})

app.get('/:agame', function (req, res) {
	if (fs.existsSync("./views/"+req.params.agame+".pug")){
		res.render(req.params.agame,{pretty:true});
	}else{
		res.render("normal_one_game",{"game_name":req.params.agame,pretty:true})
	}
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

var server = app.listen(3000,"127.0.0.1",function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('9tc app listening at http://%s:%s', host, port);
});
