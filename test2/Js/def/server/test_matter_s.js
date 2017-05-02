//�ڷ�������Ϊ��;����matterjsʵ��
const Matter = require("matter-js");
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
	Detector = Matter.Detector,
	Events = Matter.Events;

//ģ��ӿ�
function the_interface(){
	// create an engine
	var engine = Engine.create();
	//��������ֻ���㲻��Ⱦ����Ҫrender
	// create two boxes and a ground
	var boxA = Bodies.rectangle(460, 200, 80, 80, {id:4});
	var boxB = Bodies.rectangle(450, 50, 80, 80, {id:8});
	var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, id:9});

	// add all of the bodies to the world
	World.add(engine.world, [boxA, boxB, ground]);
	//console.log(boxA.collisionFilter);
	//console.log(boxB.collisionFilter);
	//console.log(ground.collisionFilter);
	Events.on(engine,'collisionStart',function(event){
		//console.log(event.pairs[0].bodyA==this.boxA);
		//console.log(boxA.position)
	});

	// run the engine	����������node�Ͼ�����run������������и���д��
	this.startGO = function(the_ws){
		//����Ĳ���ws��һ��websocket����
		//the_ws.send(JSON.stringify(boxA.position));
		setInterval(function() {
			Engine.update(engine, 1000 / 60);
			the_ws.send(JSON.stringify(boxA.position));
		}, 1000 / 60);
	};
}

module.exports = the_interface;
