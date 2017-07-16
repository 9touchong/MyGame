class LogicPiece{
    /**
     * �߼�ģʽ����
     * һЩ���Ե���������������ֲ��е�Piece��һ��
     */
    private m_x : number;
    private m_y : number;
	private p_role : string;
	private p_faction : string;
	private p_id : string;
    private living : boolean = true;    //�Ƿ����
    private landing_points; //������һ��������㼯,�����е����ڵ���������������,���飬Ԫ����[m_x,m_y]
    private menace_pieces;  //���ӿ�����в���ĵз��ӣ�����һ�����ԳԵ�����,����,Ԫ����p_id
    public constructor(p_role:string,p_faction:string,m_x:number,m_y:number,p_id?:string){
        //super();
        if (p_id){
			this.p_id = p_id;
		}
        this.m_x = m_x;
		this.m_y = m_y;
		this.p_role = p_role;
		this.p_faction = p_faction;
    }
    public set_p_id(p_id:string){
		this.p_id = p_id;
	}
    public get_property(property:string){
        let return_property: any;
        switch (property){
            case "m_x":
                return_property =  this.m_x;
                break;
            case "m_y":
                return_property =  this.m_y;
                break;
            case "p_role":
                return_property =  this.p_role;
                break;
            case "p_faction":
                return_property =  this.p_faction;
                break;
            case "p_id":
                return_property =  this.p_id;
                break;
            case "living":
                return_property =  this.living;
                break;
            case "landing_points":
                return_property =  this.landing_points;
                break;
            case "menace_pieces":
                return_property =  this.menace_pieces;
                break;
            default:
                return null;
        }
        return return_property;
    }
    public effect_update(map,piece_set){
        /**
         * Ӱ��������
         * ��õ�ǰ���ӵ����кϷ��ŵ�Ϳ�ֱ�ӳԵ����ӣ���Щ���Կ�������������е�Ӱ����
         * ��Ϊ�����ʵ��Ҫһ��������map���������Ӷ��ձ�p_set�����Է�����һ��logicplay��Ҳ���ԣ����񻹸������Ժ�Ҳ����ת��
         * ����map��p_set����LogicPlay�е�Map��pieces_set��
         * ���践��ֵ��ֻ�Ǹ��µ�ǰ���ӵ�landing_points��menace_pieces����
         */
        if (map[this.m_x][this.m_y] != this.p_id){  //Ҫ������֤map�����ӱ���λ��״̬�Ƿ�һ�£�������mapУ׼
            for (let t_x = 0 ; t_x < map.length ; t_x++){
                for (let t_y = 0 ; t_y < map[t_x].length ; t_y++){
                    if (map[t_x][t_y] == this.p_id){
                        this.move(t_x,t_y);
                        break;
                    }
                }
            };
        };
        let tem_points = [];
        let tem_pieces = [];
        let [Min_x,Min_y,Max_x,Max_y] = [0,0,8,9]; //map�����Χ����9��10����������һ����Ҫ�����Ժ��޸�
        let [r_minY,r_maxY,b_minY,b_maxY] = [0,4,5,9];  //��y�������ֺ�ڷֽ磬Ŀ��ͬ��
        switch(this.p_role){
            case "c":   //��
                for (let t_x=this.m_x-1 ; t_x>=Min_x ; t_x--){    //�����
                    let t_p_id = map[t_x][this.m_y];
                    if (!t_p_id){  //δ��������
                        tem_points.push([t_x,this.m_y]);
                    }else{  //��������
                        if (piece_set[t_p_id].p_faction != this.p_faction){ //����
                            tem_points.push([t_x,this.m_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                };
                for (let t_x = this.m_x+1 ; t_x <= Max_x ; t_x++){  //�ұ���
                    let t_p_id = map[t_x][this.m_y];
                    if (!t_p_id){  //δ��������
                        tem_points.push([t_x,this.m_y]);
                    }else{  //��������
                        if (piece_set[t_p_id].get_property("p_faction") != this.p_faction){ //����
                            tem_points.push([t_x,this.m_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                };
                for (let t_y = this.m_y-1 ; t_y >= Min_y ; t_y--){  //�ϱ���
                    let t_p_id = map[this.m_x][t_y];
                    if (!t_p_id){  //δ��������
                        tem_points.push([this.m_x,t_y]);
                    }else{  //��������
                        if (piece_set[t_p_id].p_faction != this.p_faction){ //����
                            tem_points.push([this.m_x,t_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                };
                for (let t_y = this.m_y+1 ; t_y <= Max_y ; t_y++){  //�±���
                    let t_p_id = map[this.m_x][t_y];
                    if (!t_p_id){  //δ��������
                        tem_points.push([this.m_x,t_y]);
                    }else{  //��������
                        if (piece_set[t_p_id].p_faction != this.p_faction){ //����
                            tem_points.push([this.m_x,t_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                };
                break;
            case "m":   //��
                let possible_legpoints_ma:number[][] = [  //���ȿ����ߵİ���λ�ã�ÿ������ƶ�����ӵ�̈́e�ȵ�
                    [this.m_x + 1 , this.m_y - 2 , this.m_x , this.m_y - 1],    //ǰ���������ƶ�����ӵ㣬����������e�ȵ�
                    [this.m_x + 2 , this.m_y - 1 , this.m_x + 1 , this.m_y],
                    [this.m_x + 2 , this.m_y + 1 , this.m_x + 1 , this.m_y],
                    [this.m_x + 1 , this.m_y + 2 , this.m_x , this.m_y + 1],
                    [this.m_x - 1 , this.m_y + 2 , this.m_x , this.m_y + 1],
                    [this.m_x - 2 , this.m_y + 1 , this.m_x - 1 , this.m_y],
                    [this.m_x - 2 , this.m_y - 1 , this.m_x - 1 , this.m_y],
                    [this.m_x - 1 , this.m_y - 2 , this.m_x , this.m_y - 1],
                ];
                for (let t_points of possible_legpoints_ma){
                    if (t_points[0]<Min_x || t_points[0]>Max_x || t_points[1]<Min_y || t_points[1]>Max_y){  //�����������
                        continue;
                    }
                    if (map[t_points[2]][t_points[3]]){ //����
                        continue;
                    }
                    let t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id){   //�հ׵�
                        tem_points.push([t_points[0],t_points[1]]);
                    }else if (piece_set[t_p_id].p_faction != this.p_faction){   //�е���
                        tem_points.push([t_points[0],t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "p":   //��
                let hill:boolean = false;   //��Ҫ��ɽ��
                for (let t_x=this.m_x-1 ; t_x>=Min_x ; t_x--){    //�����
                    let t_p_id = map[t_x][this.m_y];
                    if (hill){
                        if (t_p_id){  //��������
                            if (piece_set[t_p_id].p_faction != this.p_faction){ //����
                                tem_points.push([t_x,this.m_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }else{
                        if (t_p_id){    //��һ���������ӣ����ǿ��Լ��ڵ��Ǹ�ɽ
                            hill = true;
                        }else{
                            tem_points.push([t_x,this.m_y]);
                        }
                    }
                };
                hill = false;
                for (let t_x = this.m_x+1 ; t_x <= Max_x ; t_x++){  //�ұ���
                    let t_p_id = map[t_x][this.m_y];
                    if (hill){
                        if (t_p_id){  //��������
                            if (piece_set[t_p_id].p_faction != this.p_faction){ //����
                                tem_points.push([t_x,this.m_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }else{
                        if (t_p_id){
                            hill = true;
                        }else{
                            tem_points.push([t_x,this.m_y]);
                        }
                    }
                };
                hill = false;
                for (let t_y = this.m_y-1 ; t_y >= Min_y ; t_y--){  //�ϱ���
                    let t_p_id = map[this.m_x][t_y];
                    if (hill){   
                        if (t_p_id){  //��������
                            if (piece_set[t_p_id].p_faction != this.p_faction){ //����
                                tem_points.push([this.m_x,t_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }else{
                        if (t_p_id){
                            hill = true;
                        }else{
                            tem_points.push([this.m_x,t_y]);
                        }
                    }
                };
                hill = false;
                for (let t_y = this.m_y+1 ; t_y <= Max_y ; t_y++){  //�±���
                    let t_p_id = map[this.m_x][t_y];
                    if (hill){
                        if (t_p_id){  //��������
                            if (piece_set[t_p_id].p_faction != this.p_faction){ //����
                                tem_points.push([this.m_x,t_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }else{
                        if (t_p_id){
                            hill = true;
                        }else{
                            tem_points.push([this.m_x,t_y]);
                        }
                    }
                };
                break;
            case "x":   //��
                let y_min : number;
                let y_max : number;
                if (this.p_faction == "r"){
                    y_min = r_minY;
                    y_max = r_maxY;
                }else{  //b
                    y_min = b_minY;
                    y_max = b_maxY;
                };
                let possible_legpoints_xiang:number[][] = [   //�����趨�������� �������ȿ��ߵ�ͱ��ȵ� �������ĸ���
                    [this.m_x + 2 , this.m_y - 2 , this.m_x + 1 , this.m_y - 1],
                    [this.m_x + 2 , this.m_y + 2 , this.m_x + 1 , this.m_y + 1],
                    [this.m_x - 2 , this.m_y + 2 , this.m_x - 1 , this.m_y + 1],
                    [this.m_x - 2 , this.m_y - 2 , this.m_x - 1 , this.m_y - 1],
                ];
                for (let t_points of possible_legpoints_xiang){
                    if (t_points[0]<Min_x || t_points[0]>Max_x || t_points[1]<y_min || t_points[1]>y_max){
                        continue;
                    }
                    if (map[t_points[2]][t_points[3]]){ //����
                        continue;
                    }
                    let t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id){   //�հ׵�
                        tem_points.push([t_points[0],t_points[1]]);
                    }else if (piece_set[t_p_id].p_faction != this.p_faction){   //�е���
                        tem_points.push([t_points[0],t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "s":   //��
                let [x_min_s,x_max_s,y_min_s,y_max_s] = [0,0,0,0];
                if (this.p_faction == "r"){
                    [x_min_s,x_max_s,y_min_s,y_max_s] = [3,5,0,2];
                }else{  //"b"
                    [x_min_s,x_max_s,y_min_s,y_max_s] = [3,5,7,9];
                };
                let possible_landpoints_shi : number[][] = [
                    [this.m_x + 1 , this.m_y + 1],
                    [this.m_x + 1 , this.m_y - 1],
                    [this.m_x - 1 , this.m_y + 1],
                    [this.m_x - 1 , this.m_y - 1],
                ];
                for (let t_points of possible_landpoints_shi){
                    if (t_points[0]<x_min_s || t_points[0]>x_max_s || t_points[1]<y_min_s || t_points[1]>y_max_s){
                        continue;
                    };
                    let t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id){   //�հ׵�
                        tem_points.push([t_points[0],t_points[1]]);
                    }else if (piece_set[t_p_id].p_faction != this.p_faction){   //�е���
                        tem_points.push([t_points[0],t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "z":   //��
                let forward_z: number;  //��ʵ��������һ������ǰ������
                let cross_river:boolean = false;    //�Ƿ����
                if (this.p_faction == "r"){
                    //forward_z = (b_minY - r_maxY) / Math.abs(b_minY - r_maxY);
                    forward_z = 1;
                    if (this.m_y > r_maxY){
                        cross_river = true;
                    }
                }else{  //b
                    //forward_z = (r_maxY - b_minY) / Math.abs(r_maxY - b_minY);
                    forward_z = -1;
                    if (this.m_y < b_minY){
                        cross_river = true;
                    }
                };
                let possible_landpoints_zu : number[][];
                if (cross_river){
                    possible_landpoints_zu = [
                        [this.m_x,this.m_y + forward_z],
                        [this.m_x - 1 , this.m_y],
                        [this.m_x + 1 , this.m_y],
                    ];
                }else{
                    possible_landpoints_zu = [
                        [this.m_x,this.m_y + forward_z],
                    ];                    
                };
                for (let t_points of possible_landpoints_zu){
                    if (t_points[0]<Min_x || t_points[0]>Max_x || t_points[1]<Min_y || t_points[1]>Max_y){
                        continue;
                    };
                    let t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id){   //�հ׵�
                        tem_points.push([t_points[0],t_points[1]]);
                    }else if (piece_set[t_p_id].p_faction != this.p_faction){   //�е���
                        tem_points.push([t_points[0],t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "j":
                let [x_min_j,x_max_j,y_min_j,y_max_j] = [0,0,0,0];
                if (this.p_faction == "r"){
                    [x_min_j,x_max_j,y_min_j,y_max_j] = [3,5,0,2];
                }else{  //"b"
                    [x_min_j,x_max_j,y_min_j,y_max_j] = [3,5,7,9];
                };
                let possible_landpoints_jiang : number[][] = [
                    [this.m_x + 1 , this.m_y],
                    [this.m_x - 1 , this.m_y],
                    [this.m_x , this.m_y + 1],
                    [this.m_x , this.m_y - 1],
                ];
                for (let t_points of possible_landpoints_jiang){
                    if (t_points[0]<x_min_j || t_points[0]>x_max_j || t_points[1]<y_min_j || t_points[1]>y_max_j){
                        continue;
                    };
                    let t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id){   //�հ׵�
                        tem_points.push([t_points[0],t_points[1]]);
                    }else if (piece_set[t_p_id].p_faction != this.p_faction){   //�е���
                        tem_points.push([t_points[0],t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                };
                //˧�Խ����
                
                if (this.p_faction == "r"){
                    for (let t_y = this.m_y+1 ; t_y <= Max_y ; t_y++){
                        let t_p_id = map[this.m_x][t_y];
                        if (t_p_id){
                            let t_p = piece_set[t_p_id];
                            if (t_p.p_role == "j"){
                                tem_points.push([this.m_x,t_y]);
                                tem_pieces.push(t_p_id);
                            }else{
                                break;
                            }
                        }
                    }
                }else{  //b
                    for (let t_y = this.m_y-1 ; t_y >= Min_y ; t_y--){
                        let t_p_id = map[this.m_x][t_y];
                        if (t_p_id){
                            let t_p = piece_set[t_p_id];
                            if (t_p.p_role == "j"){
                                tem_points.push([this.m_x,t_y]);
                                tem_pieces.push(t_p_id);
                            }else{
                                break;
                            }
                        }
                    }
                }
                break;
            default:
                tem_points = tem_pieces = null;
        }
        this.landing_points = tem_points;
        this.menace_pieces = tem_pieces;
    }
    public move(m_x:number,m_y:number){
        this.m_x = m_x;
        this.m_y = m_y;
    }
    public kill_self(){
        this.living = false;
    }
    public revive_self(){
        this.living = true;
    }
}
export { LogicPiece };
