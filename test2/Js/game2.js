//由网上的例子改编，未改变游戏 只改变了编写方式 以面向对象即类(js中只是模拟类的方式)形式重写代码。原例子即example_game2,出处http://www.phaser-china.com/example-detail-42.html
//试图解决切换浏览器标签页游戏自动停止的现象，当然此问题也并非非解决不可的。目前虽尚无法真正解决但取得了部分进展。现记录于此：
//首先phaser的设置game.stage.disableVisibilityChange = true;并无效果。
//另，似此文件结尾这种设置定时器检测到标签页失去焦点是就调用update，并没有效果
//另，将game的config中设置forceSetTimeOut: true，经测试edge浏览器中可以，但360没效果，还会在切回标签页时有一下明显卡顿
//另，引入一个库HackTimer.js(github by turuslan),在normal_one_game.tpl中引入，HackTimer.js还有个依赖code，HackTimerWorker.min.js，当然不用在html中引入。总之引入这个库并保持上面的forceSetTimeOut，在360和edge中可以了，但谷歌浏览器仍没有效果。
//以上。
var config = {width:800,height:600,renderer:Phaser.AUTO,parent:'phaser-game',state:{ preload: preload, create: create, update: update, render: render },forceSetTimeOut: true};
//forceSetTimeOut: true
//var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(config);
function preload() {

    game.load.image('car', 'assets/sprites/car90.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');

}

var car;
var aliens;
var cursors;
//
var alien_class = {
	createNew: function(){
		var alien=game.add.sprite(game.world.randomX, game.world.randomY,'baddie');	//这里要注意虽然load的是image但add的要是sprite
		alien.name = 'alien';
		game.physics.enable(alien, Phaser.Physics.ARCADE);
        alien.body.collideWorldBounds = true;
        alien.body.bounce.setTo(0.8, 0.8);
        alien.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
		return alien;
	}
}

var car_class = {
	createNew: function(){
		var car = game.add.sprite(400, 300, 'car');
		car.name = 'car';
		car.anchor.set(0.5);

		game.physics.enable(car, Phaser.Physics.ARCADE);

		car.body.collideWorldBounds = true;
		car.body.bounce.set(0.8);
		car.body.allowRotation = true;
		car.body.immovable = true;

		return car;
	}
}
//

function create() {
	game.stage.backgroundColor = "#87CEEB";
	game.stage.disableVisibilityChange = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    aliens = game.add.group();
    aliens.enableBody = true;

    for (var i = 0; i < 5; i++)
    {
        var s = alien_class.createNew();
        s.name = 'alien' + i;
		aliens.add(s);
    }

	car=car_class.createNew();
	car.x=100;car.y=100;
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.arcade.collide(car, aliens);
    game.physics.arcade.collide( aliens );

    car.body.velocity.x = 0;
    car.body.velocity.y = 0;
    car.body.angularVelocity = 0;

    if (cursors.left.isDown)
    {
        car.body.angularVelocity = -200;
    }
    else if (cursors.right.isDown)
    {
        car.body.angularVelocity = 200;
    }

    if (cursors.up.isDown)
    {
        car.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(car.angle, 300));
    }

}

function render() {
}

	setInterval(function () {
    if (document.hidden || document.mozHidden || document.msHidden || document.webkitHidden /*|| event.type === "pause"*/){
		if (!game.isRunning){alert ('not running');}
        update();
    }
	}, 1);
