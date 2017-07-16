/**
此脚本就是由客户端逻辑层logicplay移植改编的，但改变得部分也不少，不想history等模块几乎没变，所以没有沿用模块名
*/
import {history_record} from "./history";
import {LogicPiece} from "./logicpiece";
import {ServerOrder} from "./order";
import {AI} from "./ai";
class chesslogic{
	public initMap = [
        [["c","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["c","b"]],
        [["m","r"],         ,["p","r"],         ,         ,         ,         ,["p","b"],         ,["m","b"]],
        [["x","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["x","b"]],
        [["s","r"],         ,         ,         ,         ,         ,         ,         ,         ,["s","b"]],
        [["j","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["j","b"]],
        [["s","r"],         ,         ,         ,         ,         ,         ,         ,         ,["s","b"]],
        [["x","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["x","b"]],
        [["m","r"],         ,["p","r"],         ,         ,         ,         ,["p","b"],         ,["m","b"]],
        [["c","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["c","b"]]
    ];//注意这数组，看起来就像是反了一样,以后再完善时，这里应该从数据层得到，所以现在设为public也是可以的.可以看作是侧视图
    private Map;    //和initmap不是一样的，Map的元素是可唯一代表LogicPiece对象的id
    private pieces_set: Object;   //所有棋子的集合
    private active_faction: string;  //当前应该行动的阵营,r或b
	private faction_ws: Object;	//红黑双方的玩家连接
    private _gameover: boolean;   //标志此局游戏是否已结束
    private HistoryList: history_record[];   //历史纪录列表
    private phas_var: Object;   //一些在运行过程中个别游戏功能需要的全局的变量，因为这些变量多而杂，且非用于主体程序，而且之后版本有更改的可能，放在一个{}里了
	private AI;
	public constructor(ws1?,ws2?){
		if (ws1 && ws2){
			this.startone(ws1,ws2);
		}
    }	
	public startone(ws1?,ws2?){
        /**
         * 开一局
         * 先进行Map、pieces_set的初始化工作和棋子的生成
		 */
		if (ws1 && ws2){
			this.assign_player(ws1,ws2)
		}
		if (!this.faction_ws){
			console.log("目前还无法在连接不全情况下开局");
			return 0;
		}
        this.Map = new Array();
        this.pieces_set = {};
        this.HistoryList = new Array();
        this.change_faction("r");

        var tem_P_id_num:number = 0;
        for (var t_i  = 0 ; t_i < this.initMap.length ; t_i++){
            this.Map[t_i] = new Array();
            for (var t_j = 0 ; t_j < this.initMap[t_i].length ; t_j++){
                let tem_id: string = "p_"+tem_P_id_num;
                let tem_element = this.initMap[t_i][t_j];
                if (tem_element){
                    var t_logicpiece = new LogicPiece(tem_element[0],tem_element[1],t_i,t_j,tem_id);
                    this.Map[t_i][t_j] = tem_id;
                    this.pieces_set[tem_id] = t_logicpiece;
                    tem_P_id_num += 1;
                }else{
                    this.Map[t_i][t_j] = null;
                }  
            }
        };

		this.AI = new AI(this.Map,this.pieces_set);
        this.phas_var = {};
        this.phas_var["just_move_steps"] = 0;   //连续没发生吃子的步数,判断是否磨棋时有用
		console.log("服务器已完成开局");
    }
	public assign_player(ws1,ws2){	
		/**分配通过ws接入的玩家给游戏的红黑方
		*接收两个ws连接
		*结果影响的是this.faction_ws属性
		*目前较简单，以后可能要处理诸如增减其中一个玩家的功能，后话
		*/
		this.faction_ws = {};
		if (Math.random() > 0.5){
			this.faction_ws["r"] = ws1;
			this.faction_ws["b"] = ws2;
		}else{
			this.faction_ws["b"] = ws1;
			this.faction_ws["r"] = ws2;
		};
		this.faction_ws["r"].send(JSON.stringify({"your_faction":"r"}));
		this.faction_ws["b"].send(JSON.stringify({"your_faction":"b"}));
	}

	private change_faction(t_faction?:string){  //切换当前控制阵营
        if (t_faction){
            this.active_faction = t_faction;
        }else{
            (this.active_faction == "r") ? this.active_faction = "b" : this.active_faction = "r";
        }
    }

	private undo(){ //悔棋，取游戏历史纪录中的最后一条，并按逆向规则修复逻辑层游戏状态并发命令给表现层
        let t_record = this.HistoryList.pop();
        if (!t_record){
            return 0;
        }
		let order = new ServerOrder();	//回复的命令
        order._actPieceid = t_record.MovePieceId;
        order._moveToX = t_record.FromX;
        order._moveToY = t_record.FromY;
        let t_act_piece = this.pieces_set[t_record.MovePieceId];
        this.Map[t_act_piece.m_x][t_act_piece.m_y] = null;
        t_act_piece.move(t_record.FromX,t_record.FromY);
        this.Map[t_record.FromX][t_record.FromY] = t_record.MovePieceId;
        if (t_record.DiePieceId){
            let t_re_piece = this.pieces_set[t_record.DiePieceId];
            t_re_piece.revive_self();
            order._revivePieceid = t_record.DiePieceId;
        }
		this.faction_ws["r"].send(JSON.stringify(order));
		this.faction_ws["b"].send(JSON.stringify(order));
    }

	public reply_action(demand){  
		/**
		*处理并回应客户端的操作请求
		*demand 一个{}，请求的信息内容
		*/
		console.log("reply_action 收到demand ",demand," 现在active_faction是",this.active_faction);
        let whether_change_faction: boolean = false;    //标记是否换边，但不能当时马上换，要在把返回给表现层的消息发出之后再执行
        if (demand._giveup){
            console.log("服务端收到了认输的请求");
            this._gameover = true;
			let order = new ServerOrder();
			//order._gameover = true;
            order._winner = (this.active_faction == "r") ? "b" : "r";    //简化处理，其实本地对战或本地AI对战时，谁什么时候按投降时没有限制的
			this.faction_ws["r"].send(JSON.stringify(order));
			this.faction_ws["b"].send(JSON.stringify(order));
            return 0;

        }
        if (demand._undo){
            console.log("服务端收到了悔棋的请求");
            this.undo(); this.undo();   //悔一合棋,也就是history中的后两个记录
            return 0;
        }
        if (!demand._pieceID){
            console.log("服务端接收到无_pieceID的移动请求，一定是bug，请检查代码");
            return 0;
        }
		let order = new ServerOrder();
        if (demand._moveToX!=null && demand._moveToY!=null){  //将要移动或吃子的请求
            let t_piece : LogicPiece  = this.pieces_set[demand._pieceID];
			if (t_piece.get_property("p_faction") != this.active_faction){
                console.log("服务端非行动方行动请求，一定是bug，请检查",t_piece.get_property("p_faction"),this.active_faction);
                order._invalid = true;
				this.faction_ws["r"].send(JSON.stringify(order));
				this.faction_ws["b"].send(JSON.stringify(order));
                return 0;
            }
            order._actPieceid = demand._pieceID;
            order._invalid = true;   //这里先默认_invalid非法操作为true，因为毕竟除了达成移动或吃子的条件，其他情况的moveto请求都按非法操作处理
            t_piece.effect_update(this.Map,this.pieces_set);
            
            let landing_points = t_piece.get_property("landing_points");
            if (landing_points){
                //判断[demand._moveToX,demand._moveToY]是否在t_piece.landing_points中，方法比较笨,因为js/ts没有现成的方法判断 一个数组 是否存在于 一个以数组为元素的数组中
                let IN_landing_points = false;
                for (let t_point of landing_points){
                    if (t_point[0] == demand._moveToX && t_point[1] == demand._moveToY){
                        IN_landing_points = true;
                        break;
                    }
                };
                if (IN_landing_points){
                    
                    if (!this.Map[demand._moveToX][demand._moveToY]){
                        //可以移动
                        order._moveToX = demand._moveToX;
                        order._moveToY = demand._moveToY;
                        order._invalid = false;

                        let t_record = new history_record();
                        t_record.ActFaction = this.active_faction;
                        t_record.MovePieceId = t_piece.get_property("p_id");
                        t_record.FromX = t_piece.get_property("m_x");
                        t_record.FromY = t_piece.get_property("m_y");
                        this.HistoryList.push(t_record);

                        //是否磨棋检查
                        this.phas_var["just_move_steps"] += 1;
                        if (this.phas_var["just_move_steps"] >8 ){
                            let l = this.HistoryList.length - 1;
                            if (this.compare_records(this.HistoryList[l],this.HistoryList[l-4]) && this.compare_records(this.HistoryList[l],this.HistoryList[l-8])){
                                if (this.compare_records(this.HistoryList[l-1],this.HistoryList[l-5]) && this.compare_records(this.HistoryList[l-2],this.HistoryList[l-6]) && this.compare_records(this.HistoryList[l-3],this.HistoryList[l-7])){
                                    //可以确定有磨棋行为
                                    console.log("发现有磨棋行为");
									//order._gameover = true;
                                    //判断是要和棋还是先磨棋的一方输 要注意现在写进了历史纪录的这一步操作还没有在逻辑map中更新执行 要利用AI
                                    let move_order = this.AI.oneAImove(2,this.Map,this.active_faction);
                                    if (!move_order){
                                        //和棋
                                        console.log("磨棋是因为无棋可走，和棋");
                                        order._winner ="no";
                                    }else if (t_record.MovePieceId == move_order.move_id && demand._moveToX == move_order.newX && demand._moveToY == move_order.newY){
                                        //和棋
                                        console.log("磨棋是因为除此无棋可走，和棋");
                                        order._winner ="no";
                                    }else{
                                        //先磨棋的一方输
                                        console.log(this.active_faction,"方磨棋违规，判负")
                                        order._winner = (this.active_faction == "r") ? "b" : "r";
                                    }
                                }
                            }
                        };

                        this.Map[t_record.FromX][t_record.FromY] = null;
                        t_piece.move(demand._moveToX,demand._moveToY);
                        this.Map[demand._moveToX][demand._moveToY] = t_record.MovePieceId;

                        order._change_faction = true;
                        //this.change_faction();
                        whether_change_faction = true;
                    }else{
                        let t_dying_p: LogicPiece =this.pieces_set[this.Map[demand._moveToX][demand._moveToY]];
                        if (t_dying_p.get_property("p_faction") != t_piece.get_property("p_faction")){
                            //可以吃子
                            order._moveToX = demand._moveToX;
                            order._moveToY = demand._moveToY;
                            order._dyingPieceid = this.Map[demand._moveToX][demand._moveToY];
                            order._invalid = false;

                            let t_record = new history_record();
                            t_record.ActFaction = this.active_faction;
                            t_record.MovePieceId = t_piece.get_property("p_id");
                            t_record.FromX = t_piece.get_property("m_x");
                            t_record.FromY = t_piece.get_property("m_y");
                            t_record.DiePieceId = t_dying_p.get_property("p_id");
                            this.HistoryList.push(t_record);
                            this.phas_var["just_move_steps"] = 0;
                            
                            this.Map[t_record.FromX][t_record.FromY] = null;
                            t_piece.move(demand._moveToX,demand._moveToY);
                            this.Map[demand._moveToX][demand._moveToY] = t_record.MovePieceId;
                            order._change_faction = true;
                            //this.change_faction();
                            whether_change_faction = true;
                            t_dying_p.kill_self();
                            if (t_dying_p.get_property("p_role") == "j"){   //将被吃了
								//order._gameover = true;
                                order._winner = (t_dying_p.get_property("p_faction") == "r") ? "b" : "r";
                            };
                        } 
                    } 
                }
            }
			}else{	//理论上只有pieceid无移动的请求信息不会发送到这，客户端本地就处理了
			order._invalid = false;
			console.log("服务端收到只有pieceid无移动的请求信息，一定是bug，请检查");
		}
		this.faction_ws["r"].send(JSON.stringify(order));
		this.faction_ws["b"].send(JSON.stringify(order));
        if (whether_change_faction){
            this.change_faction();
        }
		console.log("服务端reply_action 将要发送order",order);
    }

	private compare_records(r1,r2){
        /**
         * 比较两个操作记录是否一样
         * 不必所有项都比较遍了
         */
        if (r1.MovePieceId == r2.MovePieceId && r1.FromX == r2.FromX && r1.FromY == r2.FromY){
            return true;
        }
        return false;
    }
}
export { chesslogic };
