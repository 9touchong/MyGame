var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
	Bodies = Matter.Bodies,
    Composites = Matter.Composites,
	Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
	Sleeping = Matter.Sleeping;

// create engine
var engine = Engine.create(),
	world = engine.world;

//配置world
world.gravity = {x:0,y:0};

// create renderer
var render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: Math.min(document.documentElement.clientWidth, 800),
		height: Math.min(document.documentElement.clientHeight, 600),
		showVelocity: true
	}
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

//bodies的一些需初始化原有属性和自定义属性
var base_pro ={
	ori_frictionAir : 0.01,	//这里这能用确定的变量，不能用this.XXX这样的
};
//bodies需要的一些基本动作
var base_act = {
	"turn_L" : function(){	//左打轮
		Body.setAngularVelocity(this,-0.01);
	},
	"turn_R" : function(){	//右打轮
		Body.setAngularVelocity(this,0.01);
	},
	"e_Go" : function(){	//给油 前进
		//这里没有给定方法只能自行计算速度方向
		var t_radian = this.angle%(2*2*Math.PI);
		if (Math.abs(t_radian)>Math.PI){
			if (t_radian>0){
				t_radian=t_radian-2*Math.PI;
			}else{
				t_radian=t_radian+2*Math.PI;
			};
		};
		Body.setVelocity(this,{"x":(Math.cos(t_radian) * 1),"y":(Math.sin(t_radian) * 1)});
	},
	"e_N" : function(){	//空挡并回轮
		Body.setAngularVelocity(this,0);
	},
	"e_B_down" : function(){	//踩下刹车
		this.frictionAir = 0.1;
	},
	"e_B_up" : function(){	//抬起刹车
		this.frictionAir = this.ori_frictionAir;
	},
};
// add walls
World.add(world, [
	Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
]);
// create and init boxes
var Boxes = {};	//装box的容器
Boxes["boxA"] = Bodies.rectangle(400, 200, 40, 40);
Boxes.boxB = Bodies.rectangle(400, 50, 80, 80);
Object.assign(Boxes.boxA,base_act,base_pro);

// add boxes
World.add(world, [Boxes["boxA"],Boxes["boxB"]]);

// fit the render viewport to the scene
//Render.lookAt(render, {
//	min: { x: 0, y: 0},
//	max: { x: 600, y: 500 },
//});

//自定义键盘控制
$(this).keydown(function(event){
	switch (event.which){
		case (27):	//esc 暂停
			runner.enabled?runner.enabled=false:runner.enabled=true;
			break;
		case (65):	//A
			Boxes.boxA.turn_L();
			break;
		case (68):	//D
			Boxes.boxA.turn_R();
			break;
		case (87):	//W
			Boxes.boxA.e_Go();
			break;
		case (83):	//S
			Boxes.boxA.e_B_down();
			break;
		default:
			alert ("您按了无效按键");
	};
});
$(this).keyup(function(event){
	switch (event.which){
		case (83):	//S
			Boxes.boxA.e_B_up();
			break;
	};
});
