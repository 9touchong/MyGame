//������
var config = {width:800,height:600,renderer:Phaser.AUTO,parent:'phaser-game',state:{ preload: preload, create: create, update: update, render: render }};
var game = new Phaser.Game(config);
function preload() {

    game.load.image('car', 'assets/sprites/car90.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');

}

var your_car;
var cpu_cars;
var usable_Colors = [0x62bd18, 0xffbb00, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2];
//

var car_class = {
	createNew: function(){
		var car = game.add.sprite(game.world.randomX, game.world.randomY, 'car');
		car.name = 'car';
		car.turn_speed=100;	//ת����ٶ�
		car.tint=0x0000ff;	//��ɫ
		car.go_acceleration=80;	//ǰ���ļ��ٶ�
		car.reverse_acceleration=-40;	//�����ļ��ٶȣ��Ǹ���
		car.normal_drag=10;car.side_drag=100;car.brake_drag=800;//�ֱ��������״̬���໬��ᡢɲ��ʱ��Ħ����������˵�ǳ��볡�ص�����
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
			if (mode=="G"){	//ǰ�� Go ������
				car.body.acceleration=game.physics.arcade.accelerationFromRotation(car.rotation,car.go_acceleration);
			}
			else if (mode=="N"){	//neutral�յ�
				car.body.acceleration=0;
			}
			else if (mode=="B"){	//brakeɲ��
				car.body.drag.set(car.brake_drag);
			}
			else if (mode=="R"){	//reverse����
				car.body.acceleration=game.physics.arcade.accelerationFromRotation(car.rotation,car.reverse_acceleration);
			}
		}
		car.dynamic_drag = function(){//��̬�仯��Ħ������
			car.go_head_angle_dev=Math.abs(game.physics.arcade.angleBetween(new Phaser.Point(0,0),car.body.velocity)-car.rotation)/Math.PI*180;
			if (car.go_head_angle_dev>70 && car.go_head_angle_dev<110){//����͹涨��ǰ�������복���ڴ�ֱ20������ʱ�����ϴ� ���������С
				car.body.drag.set(car.side_drag);
			}else{
				car.body.drag.set(car.normal_drag);
			}
			
		}
		car.update = function(){	//����Ϸ��update�У����Զ����ô˴�,��ע������������д������һ��������������е�update����Ϸ����update�����е���ö�ѡһ�ɣ�����ŵ�����ŵ���ë���ġ�
			car.dynamic_drag();
			car.turning("S");
			car.engine("N");
			car.display_name("update");
		}


		return car;
	}
}

var cpu_car_class = {	//���Խ�ɫ
	createNew: function(){
		var cpu_car=car_class.createNew();
		cpu_car.name='cpu_car';
		cpu_car.tint= usable_Colors[game.rnd.between(0, usable_Colors.length - 1)];
		cpu_car.turnTo = function(target){	//ת��ĳĿ�� �������target��һ����Ϸ�еĶ���
			cpu_car.me_target_rot=game.physics.arcade.angleToXY(cpu_car,target.x,target.y);
			cpu_car.start_rot=cpu_car.rotation;
			cpu_car.arithmetic_d_s_t=cpu_car.me_target_rot - cpu_car.rotation;
			cpu_car.d_s_t=Math.min(Math.abs(cpu_car.arithmetic_d_s_t),2*Math.PI-Math.abs(cpu_car.arithmetic_d_s_t));
			if (cpu_car.arithmetic_d_s_t==0){
				cpu_car.turning("S");
			}
			else {
				if (cpu_car.arithmetic_d_s_t<-Math.PI || (Math.PI>cpu_car.arithmetic_d_s_t && cpu_car.arithmetic_d_s_t>0)){
				cpu_car.turning("R");
				}else{
				cpu_car.turning("L");
				}
				cpu_car.now_arithmetic_d_s_t=cpu_car.rotation-cpu_car.start_rot;
				cpu_car.now_d_s_t=Math.min(Math.abs(cpu_car.now_arithmetic_d_s_t),2*Math.PI-Math.abs(cpu_car.now_arithmetic_d_s_t));
				if (cpu_car.now_d_s_t>=cpu_car.d_s_t){
					cpu_car.turning("S");
				}
			}
		}
		return cpu_car;
	}
}

var your_car_class={	//��ҽ�ɫ
	createNew: function(){
		var your_car = car_class.createNew();
		your_car.name="yourCar";
		//���Ƽ�λ�������˴��Ժ���ԸĽ�ʹ�ı��λ������
		your_car.keys_up=game.input.keyboard.addKey(Phaser.Keyboard.UP);
		your_car.keys_down=game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		your_car.keys_left=game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		your_car.keys_right=game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		your_car.keys_space=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		var parent_update=your_car.update;	//�˴�Ϊ�˼̳�car_class�е�update
		your_car.update = function(){
			parent_update();
			//��λ����
			if (your_car.keys_left.isDown){
				your_car.body.angularVelocity=-100;
			}else if (your_car.keys_right.isDown){
				your_car.turning("R");
			}

			if (your_car.keys_up.isDown){
				your_car.engine("G");	//ǰ�� ������ǰ��
			}else if (your_car.keys_down.isDown){
				your_car.engine("R");	//����
			}

			if(your_car.keys_space.isDown){
				your_car.engine("B");	//ɲ���ƶ�
			} 
		};
		return your_car;
	}
}

//

function create() {
	game.stage.backgroundColor = "#87CEEB";
	game.stage.disableVisibilityChange = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

	//��Ϸ��ͣEsc
	game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function(){
		game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
	}, this);

	your_car=your_car_class.createNew();
	your_car.name="yourCar";
	your_car.display_name("create");
	your_car.x=100;your_car.y=100;
	//your_car.display_name("create");//��display_name����������ʾ��ʾ�����

    cpu_cars = game.add.group();
    cpu_cars.enableBody = true;

    for (var i = 0; i < 5; i++)
    {
        var s = cpu_car_class.createNew();
        s.name = 'cpu_car' + i;
		cpu_cars.add(s);
    }
	cpu_cars.forEach(function(item){
		item.display_name("create");
		item.tem_update=item.update;
		item.update = function(){
			item.tem_update();
			item.display_name("update");
			item.turnTo(your_car);
		};
	})
}

function update() {

    game.physics.arcade.collide(your_car, cpu_cars);
    game.physics.arcade.collide( cpu_cars );

	//your_car.display_name("update");

}

function render() {
	game.debug.spriteInfo(your_car, 32, 32);
}

