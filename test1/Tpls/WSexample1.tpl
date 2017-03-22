%import Conf
%#来自https://github.com/zeekay/bottle-websocket/edit/master/examples/chat/index.tpl的例子,进行了实验性的极小改编。本例子就是基本的传消息到ws服务器在接到服务器的原句的返回并显示。
<!doctype html>
<head>
    <meta charset="utf-8" />
    <title>WebSocket Chat</title>

    <style>
        li { list-style: none; }
    </style>

    <script src="/Js/jquery.1.6.4.min.js"></script>
    <script>
        $(document).ready(function() {
            if (!window.WebSocket) {
                if (window.MozWebSocket) {
                    window.WebSocket = window.MozWebSocket;
                } else {
                    $('#messages').append("<li>Your browser doesn't support WebSockets.</li>");
                }
            }
            //ws = new WebSocket('ws://192.168.1.106:2353/websocket');
            ws = new WebSocket('ws://{{Conf.localhost}}:{{Conf.localport}}/forWSexample1');
            ws.onopen = function(evt) {
                $('#messages').append('<li>Connected to chat.</li>');
            }
            ws.onmessage = function(evt) {
				alert ('received sth');
                $('#messages').append('<li>' + evt.data + '</li>');
            }
			ws.onclose = function(evt){
				alert ('webscoket has been closed!');
			}
			ws.onerror = function(evt){
				//alert ('some webscoket errors happened');
				console.log('Error occured: ' + evt.data);
			}
%#            $('#send-message').click(function() {
			$('#send').submit(function() {		
                ws.send($('#name').val() + ": " + $('#message').val());
				$('#messages').append('<li>I have sended '+$('#name').val() + ": " + $('#message').val()+'.</li>');
                $('#message').val('').focus();
                return false;
            });
        });
    </script>
</head>
<body>
    <h2>WebSocket Chat Example</h2>
%#    <form>
	<form id="send" action='.'>
        <input id="name" type="text" value="name">
        <input id="message" type="text" value="message" />
%#        <input id="send-message" type="button" value="Send" />
		<input type="submit" value="Send" />		
    </form>
    <div id="messages">
	</div>
</body>
</html>
