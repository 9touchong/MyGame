//�����ϵ����Ӹı࣬δ�ı���Ϸ ֻ�ı��˱�д��ʽ �����������(js��ֻ��ģ����ķ�ʽ)��ʽ��д���롣ԭ���Ӽ�example_game2,����http://www.phaser-china.com/example-detail-42.html
//��ͼ����л��������ǩҳ��Ϸ�Զ�ֹͣ�����󣬵�Ȼ������Ҳ���Ƿǽ�����ɵġ�Ŀǰ�����޷����������ȡ���˲��ֽ�չ���ּ�¼�ڴˣ�
//����phaser������game.stage.disableVisibilityChange = true;����Ч����
//���ƴ��ļ���β�������ö�ʱ����⵽��ǩҳʧȥ�����Ǿ͵���update����û��Ч��
//����game��config������forceSetTimeOut: true��������edge������п��ԣ���360ûЧ�����������лر�ǩҳʱ��һ�����Կ���
//������һ����HackTimer.js(github by turuslan),��normal_one_game.tpl�����룬HackTimer.js���и�����code��HackTimerWorker.min.js����Ȼ������html�����롣��֮��������Ⲣ���������forceSetTimeOut����360��edge�п����ˣ����ȸ��������û��Ч����
//���ϡ�
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
		var alien=game.add.sprite(game.world.randomX, game.world.randomY,'baddie');	//����Ҫע����Ȼload����image��add��Ҫ��sprite
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
