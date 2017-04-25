//由网上的例子改编，未改变游戏 只改变了编写方式 以面向对象即类(js中只是模拟类的方式)形式重写代码。原例子即example_game2,出处http://www.phaser-china.com/example-detail-42.html
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update, render: render });
//alert(game.disableVisibilityChange);

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
