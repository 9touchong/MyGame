<!DOCTYPE HTML>
<html>
    <head>
		<title>9touchong</title>
		<script type="text/javascript" src="/Js/phaser.2.6.2.min.js"></script>
		<script src="/Js/jquery.1.6.4.min.js"></script>
		<script>
			$(document).ready(function() {
				$('#go').click(function() {
					$('#result').append('<li>I have sended sth.</li>');
				})
			})
		</script>
	</head>
	<body>
		<form id="zwd">
			First name: <input type="text" name="firstname" value="first"><br>
			Last name: <input type="text" name="lastname" value="last"><br>
			<input type="button" value="Submit" id="go">
		</form>
		<div id="result"></div>
	</body>
</html>
