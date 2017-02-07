<!DOCTYPE HTML>
<html>
    <head>
		<title>9touchong</title>
		<script type="text/javascript" src="/Js/phaser.2.6.2.min.js"></script>
	</head>
	<body>
		<script>
var Animal = {
　　　　createNew: function(){
　　　　　　var animal = {};
　　　　　　animal.sleep = function(){ alert("睡懒觉"); };
　　　　　　return animal;
　　　　}
　　};

var Cat = {
　　　　createNew: function(){
			var cat = Animal.createNew();
　　　　　　cat.name = "大毛";
　　　　　　cat.makeSound = function(){ alert("喵喵喵"); };
			var parent_sleep=cat.sleep;
			cat.sleep = function(){
				parent_sleep();
				alert ("hau");
			}
　　　　　　return cat;
　　　　}
　　};

var cat1 = Cat.createNew();
cat1.sleep(); // 睡懒觉
		</script>
	</body>
</html>
