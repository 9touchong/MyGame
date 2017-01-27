<!DOCTYPE HTML>
<html>
    <head>
		<title>9touchong</title>
		<script type="text/javascript" src="/Js/phaser.2.6.2.min.js"></script>
	</head>
	<body>
		<script>
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('arrow', 'assets/sprites/arrow.png');
}

var sprite;
var start_rot=0;//点击时sprite的角度
var target_point_rot=0;
var d_s_t=0;//点击鼠标时sprite和target的绝对角度差
var now_d_s_t=0;//此时sprite和当初点击时状态的绝对角度差
var arithmetic_d_s_t=0;//点击鼠标时sprite和target的直接计算的角度差
var now_arithmetic_d_s_t=0;//此时sprite和当初点击时状态的直接计算的角度差
var should_turn="S";//应该转的方向,"L"左,"R"右,"S"不转。

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(400, 300, 'arrow');
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.anchor.setTo(0.5, 0.5);
    testtext=game.add.text(100,100,'target_point_rot');
    testtext2=game.add.text(100,150,'sprite.rotation');
    testtext3=game.add.text(100,200,'LRS');
    testtext4=game.add.text(100,250,'d_s_t');
    testtext5=game.add.text(100,300,'now_d_s_t');

}

function update() {
     if (game.input.activePointer.isDown){
		target_point_rot=game.physics.arcade.angleToPointer(sprite);
		start_rot=sprite.rotation;
		arithmetic_d_s_t=target_point_rot - sprite.rotation;
		d_s_t=Math.min(Math.abs(arithmetic_d_s_t),2*Math.PI-Math.abs(arithmetic_d_s_t));
		if (arithmetic_d_s_t==0){
			should_turn="S";
		}else if (arithmetic_d_s_t<-Math.PI || (Math.PI>arithmetic_d_s_t && arithmetic_d_s_t>0)){
			should_turn="R";
		}else{
			should_turn="L";
		}
     }
	 if (should_turn=="S"){
		 sprite.body.angularVelocity =  0;
	 }
	 else{
		 if (should_turn=="R"){
			 sprite.body.angularVelocity =  100;
		 }else if (should_turn=="L"){
			 sprite.body.angularVelocity =  -100;
		 }
		 now_arithmetic_d_s_t=sprite.rotation-start_rot;
		 now_d_s_t=Math.min(Math.abs(now_arithmetic_d_s_t),2*Math.PI-Math.abs(now_arithmetic_d_s_t));
		 if (now_d_s_t>=d_s_t){
			 should_turn="S"
		 }
	 }
    testtext.text="target:"+target_point_rot;
    testtext2.text="sprite.rotation"+sprite.rotation;
	testtext3.text=should_turn;
	testtext4.text="d_s_t"+d_s_t;
	testtext5.text="now_d_s_t"+now_d_s_t;
}
	 /*target减去源点的rot
	 //小于-3.14往右 小于0且大于目标rot止
	 //大于3.14往左 小于目标rot且大于0止
	 //大于-3.14小于0往左 小于目标rot止一定也小于0
	 //小于3.14大于0往右  大于目标rot止一定也大于0*/

function render() {

    game.debug.spriteInfo(sprite, 32, 32);

}
		</script>
	</body>
</html>
