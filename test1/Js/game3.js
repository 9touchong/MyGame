//碰碰车
var config = {width:800,height:600,renderer:Phaser.AUTO,parent:'phaser-game',state:{ preload: preload, create: create, update: update, render: render }};
var game = new Phaser.Game(config);
function preload() {

    game.load.image('car', 'assets/sprites/car90.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');

}

var your_car;
var cpu_cars;
var cursors;
var usable_Colors = [0x62bd18, 0xffbb00, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2];
//

var car_class = {
	createNew: function(){
		var car = game.add.sprite(game.world.randomX, game.world.randomY, 'car');
		car.name = 'car';
		car.anchor.set(0.5);

		game.physics.enable(car, Phaser.Physics.ARCADE);

		car.body.collideWorldBounds = true;
		car.body.bounce.set(0.8);
		car.body.allowRotation = true;

		car.tint=0x0000ff;
		car.display_name=function(mode){
			if (mode=="create"){
				car.name_text=game.add.text(car.x,car.y,car.name);
			}
			else if (mode="update"){
				car.name_text.x=car.x;car.name_text.y=car.y;
			}
		}


		return car;
	}
}

var cpu_car_class = {
	createNew: function(){
		var cpu_car=car_class.createNew();
		cpu_car.name='cpu_car';
		cpu_car.tint= usable_Colors[game.rnd.between(0, usable_Colors.length - 1)];
		return cpu_car;
	}
}

//

function create() {
	game.stage.backgroundColor = "#87CEEB";
	game.stage.disableVisibilityChange = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cpu_cars = game.add.group();
    cpu_cars.enableBody = true;

    for (var i = 0; i < 5; i++)
    {
        var s = cpu_car_class.createNew();
        s.name = 'cpu_car' + i;
		cpu_cars.add(s);
    }

	your_car=car_class.createNew();
	your_car.name="yourCar";
	your_car.x=100;your_car.y=100;
	//your_car.display_name("create");//用display_name方法简易演示显示玩家名
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.arcade.collide(your_car, cpu_cars);
    game.physics.arcade.collide( cpu_cars );

    your_car.body.angularVelocity = 0;

    if (cursors.left.isDown)
    {
        your_car.body.angularVelocity = -200;
    }
    else if (cursors.right.isDown)
    {
        your_car.body.angularVelocity = 200;
    }

    if (cursors.up.isDown)
    {
        your_car.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(your_car.angle, 300));
    }
	//your_car.display_name("update");

}

function render() {
	game.debug.spriteInfo(your_car, 32, 32);
}

