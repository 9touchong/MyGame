<!DOCTYPE HTML>
<html>
    <head>
		<title>9touchong</title>
		<script type="text/javascript" src="/Js/phaser.2.6.2.min.js"></script>
	</head>
	<body>
		<script>
var Cat = {
	createNew: function(){
		var cat = {};
　　　　cat.name = "大毛";
　　　　cat.makeSound = this.makeSound();
　　　　return cat;
　　},
	makeSound: function(){
		alert("喵喵");
	}
};
var cat1 = Cat.createNew();
cat1.makeSound(); // 喵喵喵
		</script>
	</body>
</html>
