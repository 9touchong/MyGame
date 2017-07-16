"use strict";
exports.__esModule = true;
var AI = (function () {
    function AI(Map, pieces_set, AI_faction) {
        if (AI_faction === void 0) { AI_faction = "b"; }
        this.Map = Map;
        this.pieces_set = pieces_set;
        this.AI_faction = AI_faction;
        this.treeDepth = 4;
        this.gene_VALUE_set();
    }
    AI.prototype.arr2clone = function (ori_arr) {
        var new_arr = [];
        for (var t = 0; t < ori_arr.length; t++) {
            new_arr[t] = ori_arr[t].slice();
        }
        ;
        return new_arr;
    };
    AI.prototype.gene_VALUE_set = function () {
        /**
         * ����VALUE_set
         * VALUE_set��ʽ��{"r":{"m":[[]....],"c":....},"b"{.....}}
         */
        this.VALUE_set = { "r": {}, "b": {} };
        this.VALUE_set["r"]["c"] = [
            [206, 206, 206, 206, 208, 208, 204, 198, 200, 194],
            [208, 212, 208, 213, 211, 212, 209, 208, 208, 206],
            [207, 209, 207, 213, 211, 212, 204, 204, 206, 204],
            [213, 216, 214, 216, 214, 214, 212, 212, 212, 212],
            [214, 233, 216, 216, 215, 215, 214, 212, 200, 200],
            [213, 216, 214, 216, 214, 214, 212, 212, 212, 212],
            [207, 209, 207, 213, 211, 212, 204, 204, 206, 204],
            [208, 212, 208, 213, 211, 212, 209, 208, 208, 206],
            [206, 206, 206, 206, 208, 208, 204, 198, 200, 194]
        ];
        this.VALUE_set["r"]["m"] = [
            [90, 90, 92, 93, 90, 90, 92, 93, 85, 88],
            [90, 96, 98, 108, 100, 98, 94, 92, 90, 85],
            [90, 103, 99, 100, 99, 101, 98, 94, 92, 90],
            [96, 97, 103, 107, 103, 102, 95, 95, 93, 88],
            [90, 94, 99, 100, 104, 103, 98, 92, 78, 90],
            [96, 97, 103, 107, 103, 102, 95, 95, 93, 88],
            [90, 103, 99, 100, 99, 101, 98, 94, 92, 90],
            [90, 96, 98, 108, 100, 98, 94, 92, 90, 85],
            [90, 90, 92, 93, 90, 90, 92, 93, 85, 88]
        ];
        this.VALUE_set["r"]["x"] = [
            [0, 0, 18, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [20, 0, 0, 0, 20, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 23, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.VALUE_set["r"]["s"] = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [20, 0, 20, 0, 0, 0, 0, 0, 0, 0],
            [0, 23, 0, 0, 0, 0, 0, 0, 0, 0],
            [20, 0, 20, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.VALUE_set["r"]["j"] = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [8888, 8888, 8888, 0, 0, 0, 0, 8888, 8888, 8888],
            [8888, 8888, 8888, 0, 0, 0, 0, 8888, 8888, 8888],
            [8888, 8888, 8888, 0, 0, 0, 0, 8888, 8888, 8888],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.VALUE_set["r"]["p"] = [
            [100, 98, 97, 96, 96, 95, 96, 97, 96, 96],
            [100, 98, 97, 99, 96, 96, 96, 96, 97, 96],
            [96, 96, 96, 99, 96, 99, 96, 100, 98, 97],
            [91, 92, 91, 98, 96, 96, 96, 99, 98, 99],
            [90, 89, 92, 100, 100, 100, 96, 101, 98, 99],
            [91, 92, 91, 98, 96, 96, 96, 99, 98, 99],
            [96, 96, 96, 99, 96, 99, 96, 100, 98, 97],
            [100, 98, 97, 99, 96, 96, 96, 96, 97, 96],
            [100, 98, 97, 96, 96, 95, 96, 97, 96, 96]
        ];
        this.VALUE_set["r"]["z"] = [
            [9, 19, 19, 19, 14, 7, 7, 0, 0, 0],
            [9, 24, 24, 23, 18, 0, 0, 0, 0, 0],
            [9, 34, 32, 27, 20, 13, 7, 0, 0, 0],
            [11, 42, 37, 29, 27, 16, 15, 0, 0, 0],
            [13, 44, 37, 30, 29, 16, 15, 0, 0, 0],
            [11, 42, 37, 29, 27, 16, 15, 0, 0, 0],
            [9, 34, 32, 27, 20, 13, 7, 0, 0, 0],
            [9, 24, 24, 23, 18, 0, 0, 0, 0, 0],
            [9, 19, 19, 19, 14, 7, 7, 0, 0, 0]
        ];
        for (var k in this.VALUE_set["r"]) {
            var t_2arr = this.arr2clone(this.VALUE_set["r"][k]);
            for (var _i = 0, t_2arr_1 = t_2arr; _i < t_2arr_1.length; _i++) {
                var t_arr = t_2arr_1[_i];
                t_arr.reverse();
            }
            ;
            this.VALUE_set["b"][k] = t_2arr;
        }
        ;
    };
    AI.prototype.getMoves = function (map, faction) {
        /**
         * //ȡ�õ�ǰthis.Map������map�����£�AI_faction��������Ӫ�������������п����ŷ�
         * returnһ�����飬Ԫ����һ��{"move_id": ,"oldX": ,"oldY": ,"newX": ,"newY": }
         */
        if (!map) {
            map = this.Map;
        }
        ;
        if (!faction) {
            faction = this.AI_faction;
        }
        ;
        var Moves = new Array();
        for (var t_x = 0; t_x < map.length; t_x++) {
            for (var t_y = 0; t_y < map[t_x].length; t_y++) {
                var t_p_id = map[t_x][t_y];
                if (!t_p_id) {
                    continue;
                }
                ;
                var t_piece = this.pieces_set[t_p_id];
                if (t_piece.get_property("p_faction") != faction) {
                    continue;
                }
                ;
                t_piece.effect_update(map, this.pieces_set);
                for (var _i = 0, _a = t_piece.get_property("landing_points"); _i < _a.length; _i++) {
                    var t_point = _a[_i];
                    Moves.push({ "move_id": t_p_id, "oldX": t_x, "oldY": t_y, "newX": t_point[0], "newY": t_point[1] });
                }
            }
        }
        ;
        return Moves;
    };
    AI.prototype.getEvaluate = function (map, faction) {
        /**
         * //ȡ�õ�ǰthis.Map������map�����£�AI_faction��������Ӫ�� ��������
         * ���ص�Ӧ����һ������
         * ����faction��ʲô���������۶�������Խ��Խ��
         */
        if (!map) {
            map = this.Map;
        }
        ;
        if (!faction) {
            faction = this.AI_faction;
        }
        ;
        var Sum_value = 0;
        for (var t_x = 0; t_x < map.length; t_x++) {
            for (var t_y = 0; t_y < map[t_x].length; t_y++) {
                if (!map[t_x][t_y]) {
                    continue;
                }
                ;
                var t_piece = this.pieces_set[map[t_x][t_y]];
                var t_role = t_piece.get_property("p_role");
                var t_faction = t_piece.get_property("p_faction");
                var t_value = this.VALUE_set[t_faction][t_role][t_x][t_y];
                if (t_faction == faction) {
                    Sum_value += t_value;
                }
                else {
                    Sum_value -= t_value;
                }
            }
        }
        ;
        return Sum_value;
    };
    AI.prototype.getAlphaBeta = function (A, B, depth, map, faction) {
        /**
         * A:��ǰ����value  B:����value  depth���㼶
         * �������ѽ⣬����һ����getMoves�������Ƶ�obj,{"move_id": ,"oldX": ,"oldY": ,"newX": ,"newY": ,"value": };ֻ���˸�����
         */
        if (depth == 0) {
            return { "value": this.getEvaluate(map, faction) };
        }
        var Moves = this.getMoves(map, faction);
        for (var _i = 0, Moves_1 = Moves; _i < Moves_1.length; _i++) {
            var move = Moves_1[_i];
            //�������߷�
            var dying_id = map[move["newX"]][move["newY"]]; //ע������Ϊnull
            map[move["newX"]][move["newY"]] = move["move_id"];
            map[move["oldX"]][move["oldY"]] = null;
            this.pieces_set[move["move_id"]].move(move["newX"], move["newY"]);
            if (dying_id && this.pieces_set[dying_id].get_property("p_role") == "j") {
                //�ȳ����߷�
                map[move["oldX"]][move["oldY"]] = move["move_id"];
                map[move["newX"]][move["newY"]] = dying_id;
                this.pieces_set[move["move_id"]].move(move["oldX"], move["oldY"]);
                //ֱ��return rootKey
                return { "move_id": move["move_id"], "oldX": move["oldX"], "oldY": move["oldY"], "newX": move["newX"], "newY": move["newY"], "value": 8888 };
            }
            else {
                var val = void 0;
                var next_val = this.getAlphaBeta(-B, -A, depth - 1, map, (faction == "r") ? "b" : "r");
                if (next_val) {
                    val = -next_val.value;
                }
                else {
                    val = null;
                }
                //�����߷�
                map[move["oldX"]][move["oldY"]] = move["move_id"];
                map[move["newX"]][move["newY"]] = dying_id;
                this.pieces_set[move["move_id"]].move(move["oldX"], move["oldY"]);
                if (val >= B) {
                    return { "move_id": move["move_id"], "oldX": move["oldX"], "oldY": move["oldY"], "newX": move["newX"], "newY": move["newY"], "value": B };
                }
                ;
                if (val > A) {
                    A = val; //���������߷�
                    if (this.treeDepth == depth) {
                        var rootKey = { "move_id": move["move_id"], "oldX": move["oldX"], "oldY": move["oldY"], "newX": move["newX"], "newY": move["newY"], "value": A };
                    }
                }
                ;
            }
        }
        ;
        if (this.treeDepth == depth) {
            if (!rootKey) {
                return false;
            }
            else {
                return rootKey;
            }
        }
        ;
        return { "value": A };
    };
    AI.prototype.oneAImove = function (depth, map, faction) {
        if (!depth) {
            depth = this.treeDepth;
        }
        if (!map) {
            map = this.Map;
        }
        if (!faction) {
            faction = this.AI_faction;
        }
        //return this.getAlphaBeta(-99999,99999,this.treeDepth,this.arr2clone(this.Map),this.AI_faction);
        return this.getAlphaBeta(-99999, 99999, depth, this.arr2clone(map), faction);
    };
    return AI;
}());
exports.AI = AI;
