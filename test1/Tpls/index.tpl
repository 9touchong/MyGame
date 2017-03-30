%#print ('it is index')
%#####传入UserInfo
<!DOCTYPE HTML>
<html>
    <head>
		<meta charset="UTF-8"> 
		<title>9touchong</title>
		<script type="text/javascript" src="/Js/phaser.2.6.2.min.js"></script>
    </head>
    <body>
	<div id="User">
%if not UserInfo:	#目前的逻辑理论上不会到这里
		<a href="/login">登陆</a>
%else:
		<h4>您好{{UserInfo['name']}}<h4><a href="/login">退出</a>
%end
	</div>
	<div id="phaser-game_lis">
	    <a href="/test">test</a><a href="/test2">test2</a><br/>
	    <a href="/turn_rotation_test1">转向模型1</a>
	    <a href="/turn_rotation_test2">转向模型2</a><br/>
	    <a href="/example_game1">example_game1</a>
	    <a href="/example_game2">example_game2</a><br/>
	    <a href="/game1">game1</a>
	    <a href="/game2">game2</a>
	    <a href="/game3">game3</a><br/>
        <a href="/WSexample1">WS例子-chat</a>
	</div>
    </body>
</html>
