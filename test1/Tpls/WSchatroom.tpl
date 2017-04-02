%#接收参数UserInfo
%#尝试基于WS做一个类似于聊天室的页面，比较简化。服务器处理地址、聊天室成员等信息就固定了，也不涉及历史消息，主要只有收发消息。
%#这里收发msg都是json字串，两边都要再处理
%import Conf
<!doctype HTML>
<html>
	<head>
		<meta charset="utf-8" />
		<title>WebSocket聊天室</title>
		<script src="/Js/jquery.1.6.4.min.js"></script>
		<script src="/Js/jquery.cookie.js"></script>
		<script src="/Js/json2.js"></script>
		<style type="text/css">
			li{
				list-style: none;
			}
			.your_msg{
				text-align:right;
				list-style: none;
			}
			.others_msg{
				text-align:left;
				list-style: none;
			}
		</style>
		<script>
        $(document).ready(function() {
            if (!window.WebSocket) {
                if (window.MozWebSocket) {
                    window.WebSocket = window.MozWebSocket;
                } else {
                    $('#recrive_panel').append("<li>Your browser doesn't support WebSockets.</li>");
                }
            }
            ws = new WebSocket('ws://{{Conf.localhost}}:{{Conf.localport}}/forWSchatroom');
            ws.onopen = function(evt) {
                $('#recrive_panel').append('<li>you have in chat room</li>');
				//WS连接后首次向服务器发送信息，这里就发送token来验证身份
				ws.send($.cookie('access_token'));
            }
            ws.onmessage = function(evt) {
				var data=JSON.parse(evt.data);
				if (data.name=="{{UserInfo['name']}}"){
					$('#recrive_panel').append('<li class="your_msg">' +data.name+':'+data.word+ '</li>');
				}else{
					$('#recrive_panel').append('<li class="others_msg">' +data.name+':'+data.word+ '</li>');
				}
            }
			ws.onclose = function(evt){
                $('#recrive_panel').append('<li>webscoket has been closed!</li>');
			}
			ws.onerror = function(evt){
                $('#recrive_panel').append('<li>some error happened</li>');
				console.log('Error occured: ' + evt.data);
			}
			$('#send_msg').click(function(){
				//var will_send=$('#send_msg_textarea').val()
				var will_send=JSON.stringify({"name":"{{UserInfo['name']}}","word":$('#send_msg_textarea').val()});
				ws.send(will_send);
				$('#send_msg_textarea').val("").focus();
			})
		})
		</script>
	</head>
	<body>
		<h3>聊天室</h3>
		<div id="recrive_panel" style="width:80%;height:30em;border:4px solid #FFF">
			<li class="others_msg">others:opipjsdfi</li>
			<li class="your_msg">your:opipjsdfi</li>
		</div>
		<div id="send_panel" style="width:75%;height:5em;border:2px solid #F00">
			<textarea id="send_msg_textarea" style="width:80%;height:70%;font-size:1.5em;"></textarea>
			<button id="send_msg">发送</button>
		</div>
	</body>
</html>
