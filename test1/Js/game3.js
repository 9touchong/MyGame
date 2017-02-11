//碰碰车
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
		car.turn_speed=100;	//转向的速度
		car.tint=0x0000ff;	//着色
		car.go_acceleration=80;	//前进的加速度
		car.reverse_acceleration=-40;	//倒档的加速度，是负数
		car.normal_drag=10;car.side_drag=100;car.brake_drag=800;//分别代表正常状态、侧滑打横、刹车时的摩擦阻力可以说是车与场地的阻力
		car.go_head_angle_dev=0;	//前进时方向与车体的角度偏差，动态计算阻力时用得到,为计算方便这里用度数绝对值

		car.anchor.set(0.5);

		game.physics.enable(car, Phaser.Physics.ARCADE);
		car.body.collideWorldBounds = true;
		car.body.bounce.set(0.8);	//弹性
		car.body.allowRotation = true;
		car.body.maxVelocity.set(100);	//最大速度
		//car.body.drag.x=100;car.body.drag.y=100;	//车与场地的阻力


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
			if (mode=="G"){	//前进 Go 踩油门
				car.body.acceleration=game.physics.arcade.accelerationFromRotation(car.rotation,car.go_acceleration);
			}
			else if (mode=="N"){	//neutral空档
				car.body.acceleration=0;
			}
			else if (mode=="B"){	//brake刹车
				car.body.drag.set(car.brake_drag);
			}
			else if (mode=="R"){	//reverse倒挡
				car.body.acceleration=game.physics.arcade.accelerationFromRotation(car.rotation,car.reverse_acceleration);
			}
		}
		car.dynamic_drag = function(){//动态变化的摩擦阻力
			car.go_head_angle_dev=Math.abs(game.physics.arcade.angleBetween(new Phaser.Point(0,0),car.body.velocity)-car.rotation)/Math.PI*180;
			if (car.go_head_angle_dev>70 && car.go_head_angle_dev<110){//这里就规定当前进方向与车体在垂直20度左右时阻力较大 其他情况较小
				car.body.drag.set(car.side_drag);
			}else{
				car.body.drag.set(car.normal_drag);
			}
			
		}
		car.update = function(){	//在游戏的update中，会自动调用此处,但注意再像这样的写法对于一个对象，最好是类中的update与游戏主体update函数中的最好二选一吧，这里放点那里放点会出毛病的。
			car.dynamic_drag();
			car.turning("S");
			car.engine("N");
			car.display_name("update");
		}


		return car;
	}
}

var cpu_car_class = {	//电脑角色
	createNew: function(){
		var cpu_car=car_class.createNew();
		cpu_car.name='cpu_car';
		cpu_car.tint= usable_Colors[game.rnd.between(0, usable_Colors.length - 1)];
		cpu_car.turnTo = function(target){	//转向某目标 传入参数target是一个游戏中的对象
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

var your_car_class={	//玩家角色
	createNew: function(){
		var your_car = car_class.createNew();
		your_car.name="yourCar";
		//控制键位声明，此处以后可以改进使改变键位更容易
		your_car.keys_up=game.input.keyboard.addKey(Phaser.Keyboard.UP);
		your_car.keys_down=game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		your_car.keys_left=game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		your_car.keys_right=game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		your_car.keys_space=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		var parent_update=your_car.update;	//此处为了继承car_class中的update
		your_car.update = function(){
			parent_update();
			//键位功能
			if (your_car.keys_left.isDown){
				your_car.body.angularVelocity=-100;
			}else if (your_car.keys_right.isDown){
				your_car.turning("R");
			}

			if (your_car.keys_up.isDown){
				your_car.engine("G");	//前进 加油门前进
			}else if (your_car.keys_down.isDown){
				your_car.engine("R");	//倒车
			}

			if(your_car.keys_space.isDown){
				your_car.engine("B");	//刹车制动
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

	//游戏暂停Esc
	game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function(){
		game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
	}, this);

	your_car=your_car_class.createNew();
	your_car.name="yourCar";
	your_car.display_name("create");
	your_car.x=100;your_car.y=100;
	//your_car.display_name("create");//用display_name方法简易演示显示玩家名

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

