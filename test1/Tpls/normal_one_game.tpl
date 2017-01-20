%#用于任一一个通用型game的html模板。单gamejs，名称既是路由名也是js文件名
%#传入game_name
<!DOCTYPE HTML>
<html>
	<head>
		<title>9touchong {{game_name}}</title>
		<script type="text/javascript" src="/Js/phaser.2.6.2.min.js"></script>
	</head>
	<body>
		<div id="phaser-game"></div>
		<script type="text/javascript" src="/Js/{{game_name}}.js"></script>
	</body>
</html>
