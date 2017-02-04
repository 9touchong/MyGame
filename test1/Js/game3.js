//������
var config = {width:800,height:600,renderer:Phaser.AUTO,parent:'phaser-game',state:{ preload: preload, create: create, update: update, render: render }};
var game = new Phaser.Game(config);
function preload() {

    game.load.image('car', 'assets/sprites/car90.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');

}

var test_text;
var your_car;
var cpu_cars;
var cursors;
var usable_Colors = [0x62bd18, 0xffbb00, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2];
//

var car_class = {
	createNew: function(){
		var car = game.add.sprite(game.world.randomX, game.world.randomY, 'car');
		car.name = 'car';
		car.turn_speed=100;	//ת����ٶ�
		car.tint=0x0000ff;	//��ɫ
		car.go_acceleration=80;	//ǰ���ļ��ٶ�
		car.go_head_angle_dev=0;	//ǰ��ʱ�����복��ĽǶ�ƫ���̬��������ʱ�õõ�,Ϊ���㷽�������ö�������ֵ

		car.anchor.set(0.5);

		game.physics.enable(car, Phaser.Physics.ARCADE);
		car.body.collideWorldBounds = true;
		car.body.bounce.set(0.8);	//����
		car.body.allowRotation = true;
		car.body.maxVelocity.set(100);	//����ٶ�
		//car.body.drag.x=100;car.body.drag.y=100;	//���볡�ص�����


		car.display_name=function(mode){
			if (mode=="create"){
				car.name_text=game.add.text(car.x,car.y,car.name);
			}
			else if (mode="update"){
				car.name_text.x=car.x;car.name_text.y=car.y;
			}
		}
		car.turning = function(mode){
			if (mode=="S"){
				car.body.angularVelocity = 0;
			}
			else if (mode=="L"){
				car.body.angularVelocity = -car.turn_speed;
			}
			else if (mode=="R"){
				car.body.angularVelocity = car.turn_speed;
			}
		}
		car.engine = function(mode){
			if (mode=="Go"){	//ǰ�� ������
				car.body.acceleration=game.physics.arcade.accelerationFromRotation(car.rotation,car.go_acceleration);
			}
			else if (mode=="N"){	//neutral�յ�
				car.body.acceleration=0;
			}
			else if (mode=="B"){	//brakeɲ��
			}
			else if (mode=="R"){	//reverse����
			}
		}
		car.dynamic_drag = function(){//��̬�仯��Ħ������
			car.go_head_angle_dev=Math.abs(game.physics.arcade.angleBetween(new Phaser.Point(0,0),car.body.velocity)-car.rotation)/Math.PI*180;
			if (car.go_head_angle_dev>70 && car.go_head_angle_dev<110){//����͹涨��ǰ�������복���ڴ�ֱ20������ʱ�����ϴ� ���������С
				car.body.drag.set(100);
			}else{
				car.body.drag.set(1);
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
	//your_car.display_name("create");//��display_name����������ʾ��ʾ�����
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.arcade.collide(your_car, cpu_cars);
    game.physics.arcade.collide( cpu_cars );

    your_car.turning("S");
	your_car.body.acceleration = 0;

    if (cursors.left.isDown)
    {
        your_car.turning("L");
    }
    else if (cursors.right.isDown)
    {
        your_car.turning("R");
    }

    if (cursors.up.isDown)
    {
		your_car.body.acceleration=game.physics.arcade.accelerationFromRotation(your_car.rotation,your_car.go_acceleration);//������ǰ��
    }
	//your_car.display_name("update");
	your_car.dynamic_drag();

}

function render() {
	game.debug.spriteInfo(your_car, 32, 32);
}

