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
var now_point_rot=0;
var d_s_t=0;//sprite和target的角度差

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(400, 300, 'arrow');
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.anchor.setTo(0.5, 0.5);
    testtext=game.add.text(100,100,'now_point_rot');
    testtext2=game.add.text(100,150,'sprite.rotation');
    testtext3=game.add.text(100,200,'LR');
    testtext4=game.add.text(100,250,'d_s_t');

}

function update() {
    testtext.text="target:"+now_point_rot;
    testtext2.text="sprite.rotation"+sprite.rotation;
    //sprite.rotation = game.physics.arcade.angleToPointer(sprite);
     if (game.input.activePointer.isDown){
		now_point_rot=game.physics.arcade.angleToPointer(sprite);
		d_s_t=now_point_rot - sprite.rotation;
		testtext4.text=d_s_t;
     }
	 /*target减去源点的rot
	 //小于-3.14往右 小于0且大于目标rot止
	 //大于3.14往左 小于目标rot且大于0止
	 //大于-3.14小于0往左 小于目标rot止一定也小于0
	 //小于3.14大于0往右  大于目标rot止一定也大于0*/
     if (d_s_t<-3.14){//要向右
		testtext3.text="R";
			if (sprite.rotation<now_point_rot||sprite.rotation>0){
				sprite.body.angularVelocity =  100; 
			}else{
				sprite.body.angularVelocity =  0;
			}
         }
	 else if(3.14>d_s_t&&d_s_t>0){//向右
		testtext3.text="R";
			if (sprite.rotation<now_point_rot){
				sprite.body.angularVelocity =  100; 
			}else{
				sprite.body.angularVelocity =  0;
			}
	 }
	 else if (d_s_t>3.14){//向左
		testtext3.text="L";
			if (sprite.rotation>now_point_rot||sprite.rotation<0){
				sprite.body.angularVelocity =  -100; 
			}else{
				sprite.body.angularVelocity =  0;
			}
	 }
	 else{//要向左
		testtext3.text="L";
			if (sprite.rotation>now_point_rot){
				sprite.body.angularVelocity =  -100; 
			}else{
				sprite.body.angularVelocity =  0;
			}
         }

}

function render() {

    game.debug.spriteInfo(sprite, 32, 32);

}
		</script>
	</body>
</html>
