//test
var car1={"name":"bhhbbh","l":1,"r":1};
var base_pro = {
	"ori":this.name,
};
var base_act = {
	"L":function(){this.l+=1;},
	"R":function(){this.r+=1;},
};
Object.assign(car1,base_act,base_pro)
//
console.log(car1);
console.log(base_act);
console.log(base_pro);
