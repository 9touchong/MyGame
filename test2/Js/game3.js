//碰碰车
var config = {width:800,height:600,renderer:Phaser.AUTO,parent:'phaser-game'};
var game = new Phaser.Game(config);
//一些全局变量
var usable_Colors = [0x62bd18, 0xffbb00, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2];
var end_info = {	//在最后的end场景中用
	death_order:null,	//角色死亡顺序
};
/*-------------角色类-------------*/
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
		car.HP=1;

		car.anchor.set(0.5);

		game.physics.enable(car, Phaser.Physics.ARCADE);
		car.body.collideWorldBounds = true;
		car.body.bounce.set(0.8);	//弹性
		car.body.allowRotation = true;
		car.body.maxVelocity.set(100);	//最大速度
		//car.body.drag.x=100;car.body.drag.y=100;	//车与场地的阻力


		car.display_name=function(mode){
			if (mode=="create"){
				car.name_text=game.add.text(-200,-200,car.name);
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
		car.be_crashed = function(){	//被撞毁
			if ("name_text" in car){	//已显示了角色名
				car.name_text.kill();	//经测试用destroy报错几率高，因为其将对象彻底销毁而kill仍留在内存中
			}
			car.kill();
		}


		return car;
	}
}

var cpu_car_class = {	//电脑角色
	createNew: function(){
		var cpu_car=car_class.createNew();
		cpu_car.name='cpu_car';
		cpu_car.tint= usable_Colors[game.rnd.between(0, usable_Colors.length - 1)];
		cpu_car.turnTo = function(target){	//转向某目标 传入参数target是一个游戏中的对象，可以传入第二个参数，reverse，布尔值，为true时反转。
			//cpu_car.me_target_rot=game.physics.arcade.angleToXY(cpu_car,target.x,target.y);
			var reverse = arguments[1] ? arguments[1] : false;//当为true时反转，代表背对次目标
			if (reverse){
				var tem=game.physics.arcade.angleToXY(cpu_car,target.x,target.y);
				if (tem>0){
					cpu_car.me_target_rot = tem-Math.PI;
				}else{
					cpu_car.me_target_rot = tem+Math.PI;
				}
			}else{
				cpu_car.me_target_rot=game.physics.arcade.angleToXY(cpu_car,target.x,target.y);
			}
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
/*---------------以上--------------*/
game.States = {};

game.States.boot = function(){
	this.preload = function(){
		if(typeof(GAME) !== "undefined") {
    		this.load.baseURL = GAME + "/";
    	}
        if(!game.device.desktop){
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forcePortrait = true;
            this.scale.refresh();
        }
		game.load.image('loading', 'assets/preloader.gif');
	}
	this.create = function(){
		game.state.start('preload');
	}
}
game.States.preload = function(){
	this.preload = function(){
		var loadingSprite = game.add.sprite(game.height/3, game.height/2, 'loading');
		game.load.setPreloadSprite(loadingSprite);	//这里加载资源少，几乎看不到loading进度条，经测试多加载点东西就正常显示了。
		game.load.image('car', 'assets/sprites/car90.png');
		game.load.image('baddie', 'assets/sprites/space-baddie.png');
		game.load.image('start_btn', 'assets/startgameBtn.png');
		game.load.image('gameover', 'assets/gameover.png');
		game.load.audio('hit_sound', 'assets/pipe-hit.wav');
	}
	this.create = function(){
		game.state.start("menu");
	}
}
game.States.menu = function(){
	this.create = function(){
		var start_btn = game.add.button(game.width/2, game.height/2, 'start_btn', function() {
			game.state.start('play');
		});
		start_btn.anchor.setTo(0.5, 0.5);
	}
}
game.States.play = function(){
	end_info.death_order = new Phaser.ArraySet([]);
	var your_car;
	var cpu_cars;
	var role_list = new Phaser.ArraySet([]);
	var PlaySounds = {};	//play场景中的音效合集
	this.create = function(){
		PlaySounds.soundHit = game.add.sound('hit_sound');
		game.stage.backgroundColor = "#87CEEB";
		game.stage.disableVisibilityChange = true;
	
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	
		//游戏暂停Esc
		game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function(){
			game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
		}, this);
	
		your_car=your_car_class.createNew();
		your_car.name="yourCar";
		your_car.display_name("create");//用display_name方法简易演示显示玩家名
		your_car.x=100;your_car.y=100;
		role_list.add(your_car);
	
	    cpu_cars = game.add.group();
	    cpu_cars.enableBody = true;
	
	    for (var i = 0; i < 5; i++)
	    {
	        var s = cpu_car_class.createNew();
	        s.name = 'cpu_car' + i;
			cpu_cars.add(s);
			role_list.add(s);
	    }
		cpu_cars.forEach(function(item){
			item.display_name("create");	//角色名
			item.behavior = function(mode){	//规定的AI行为的方法
				if (mode=="create"){
					item.chose_fillowTarget = function(){
						item.followTarget = Phaser.ArrayUtils.getRandomItem(role_list.list);
						game.time.events.add(Phaser.Timer.SECOND * game.rnd.integerInRange(4,11), item.chose_fillowTarget, this);
					};
					item.chose_fillowTarget();	//随机选择对象追逐,并在一会儿后重复
				}else if (mode=="update"){
					item.turnTo(item.followTarget);
					item.engine("G");
				}
			}
			item.behavior("create");
			item.tem_update=item.update;
			item.update = function(){
				item.tem_update();
				item.display_name("update");
				item.behavior("update");
			};
		})
	}
	this.update = function(){
		game.physics.arcade.collide(your_car, cpu_cars, this.car_collided);
		game.physics.arcade.collide(cpu_cars, cpu_cars, this.car_collided);
		if (this.check_gameover()){
			this.GameOver();
		}
	}
	this.render = function(){
		game.debug.spriteInfo(your_car, 32, 32);
	}
	//其他自定功能函数
	this.car_collided = function(car1,car2){	//car相撞的处理函数
		PlaySounds.soundHit.play();
		car1.HP -= 1;
		car2.HP -= 1;
		if (car1.HP <= 0){car1.be_crashed();end_info.death_order.add(car1.name);};
		if (car2.HP <= 0){car2.be_crashed();end_info.death_order.add(car2.name);};
	}
	this.check_gameover = function(){	//检查是否游戏结束的条件
		if (!your_car.alive || cpu_cars.total==0){
			return true;
		}else{return false;}
	}
	this.GameOver = function(){
		if (this.gameISover){
			return 0;
		}else{
			this.gameISover = true;
		}
		game.physics.arcade.isPaused = true;
		var gameOverpng = game.add.sprite(game.width/2, game.height/2, 'gameover');
		gameOverpng.anchor.setTo(0.5, 0.5);
		var gameover_tween=game.add.tween(gameOverpng).from( { y: 0,alpha: 0.5}, 5000, Phaser.Easing.Bounce.Out, true);
		gameover_tween.onComplete.add(function(){game.state.start('end');}, this);
	}
}
game.States.end = function(){
	this.create = function(){
		game.add.text(200,200,end_info.death_order.first,{ font: "65px Arial", fill: "#ff0044", align: "center" });	//此场景可显示此局游戏统计信息，这里只象征性的显示了第一个死亡的。
	}
}

//

game.state.add('boot', game.States.boot);
game.state.add("preload", game.States.preload);
game.state.add("menu", game.States.menu);
game.state.add("play", game.States.play);
game.state.add("end", game.States.end);

game.state.start("boot");
