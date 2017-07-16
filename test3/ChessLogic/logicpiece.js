"use strict";
exports.__esModule = true;
var LogicPiece = (function () {
    function LogicPiece(p_role, p_faction, m_x, m_y, p_id) {
        this.living = true; //�Ƿ�����
        //super();
        if (p_id) {
            this.p_id = p_id;
        }
        this.m_x = m_x;
        this.m_y = m_y;
        this.p_role = p_role;
        this.p_faction = p_faction;
    }
    LogicPiece.prototype.set_p_id = function (p_id) {
        this.p_id = p_id;
    };
    LogicPiece.prototype.get_property = function (property) {
        var return_property;
        switch (property) {
            case "m_x":
                return_property = this.m_x;
                break;
            case "m_y":
                return_property = this.m_y;
                break;
            case "p_role":
                return_property = this.p_role;
                break;
            case "p_faction":
                return_property = this.p_faction;
                break;
            case "p_id":
                return_property = this.p_id;
                break;
            case "living":
                return_property = this.living;
                break;
            case "landing_points":
                return_property = this.landing_points;
                break;
            case "menace_pieces":
                return_property = this.menace_pieces;
                break;
            default:
                return null;
        }
        return return_property;
    };
    LogicPiece.prototype.effect_update = function (map, piece_set) {
        /**
         * Ӱ��������
         * ���õ�ǰ���ӵ����кϷ��ŵ��Ϳ�ֱ�ӳԵ����ӣ���Щ���Կ��������������е�Ӱ����
         * ��Ϊ������ʵ��Ҫһ��������map���������Ӷ��ձ�p_set�����Է�����һ��logicplay��Ҳ���ԣ����񻹸��������Ժ�Ҳ����ת��
         * ����map��p_set����LogicPlay�е�Map��pieces_set��
         * ���践��ֵ��ֻ�Ǹ��µ�ǰ���ӵ�landing_points��menace_pieces����
         */
        if (map[this.m_x][this.m_y] != this.p_id) {
            for (var t_x = 0; t_x < map.length; t_x++) {
                for (var t_y = 0; t_y < map[t_x].length; t_y++) {
                    if (map[t_x][t_y] == this.p_id) {
                        this.move(t_x, t_y);
                        break;
                    }
                }
            }
            ;
        }
        ;
        var tem_points = [];
        var tem_pieces = [];
        var _a = [0, 0, 8, 9], Min_x = _a[0], Min_y = _a[1], Max_x = _a[2], Max_y = _a[3]; //map��������Χ����9��10����������һ����Ҫ�����Ժ��޸�
        var _b = [0, 4, 5, 9], r_minY = _b[0], r_maxY = _b[1], b_minY = _b[2], b_maxY = _b[3]; //��y�������ֺ��ڷֽ磬Ŀ��ͬ��
        switch (this.p_role) {
            case "c"://��
                for (var t_x = this.m_x - 1; t_x >= Min_x; t_x--) {
                    var t_p_id = map[t_x][this.m_y];
                    if (!t_p_id) {
                        tem_points.push([t_x, this.m_y]);
                    }
                    else {
                        if (piece_set[t_p_id].p_faction != this.p_faction) {
                            tem_points.push([t_x, this.m_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                }
                ;
                for (var t_x = this.m_x + 1; t_x <= Max_x; t_x++) {
                    var t_p_id = map[t_x][this.m_y];
                    if (!t_p_id) {
                        tem_points.push([t_x, this.m_y]);
                    }
                    else {
                        if (piece_set[t_p_id].get_property("p_faction") != this.p_faction) {
                            tem_points.push([t_x, this.m_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                }
                ;
                for (var t_y = this.m_y - 1; t_y >= Min_y; t_y--) {
                    var t_p_id = map[this.m_x][t_y];
                    if (!t_p_id) {
                        tem_points.push([this.m_x, t_y]);
                    }
                    else {
                        if (piece_set[t_p_id].p_faction != this.p_faction) {
                            tem_points.push([this.m_x, t_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                }
                ;
                for (var t_y = this.m_y + 1; t_y <= Max_y; t_y++) {
                    var t_p_id = map[this.m_x][t_y];
                    if (!t_p_id) {
                        tem_points.push([this.m_x, t_y]);
                    }
                    else {
                        if (piece_set[t_p_id].p_faction != this.p_faction) {
                            tem_points.push([this.m_x, t_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                }
                ;
                break;
            case "m"://��
                var possible_legpoints_ma = [
                    [this.m_x + 1, this.m_y - 2, this.m_x, this.m_y - 1],
                    [this.m_x + 2, this.m_y - 1, this.m_x + 1, this.m_y],
                    [this.m_x + 2, this.m_y + 1, this.m_x + 1, this.m_y],
                    [this.m_x + 1, this.m_y + 2, this.m_x, this.m_y + 1],
                    [this.m_x - 1, this.m_y + 2, this.m_x, this.m_y + 1],
                    [this.m_x - 2, this.m_y + 1, this.m_x - 1, this.m_y],
                    [this.m_x - 2, this.m_y - 1, this.m_x - 1, this.m_y],
                    [this.m_x - 1, this.m_y - 2, this.m_x, this.m_y - 1],
                ];
                for (var _i = 0, possible_legpoints_ma_1 = possible_legpoints_ma; _i < possible_legpoints_ma_1.length; _i++) {
                    var t_points = possible_legpoints_ma_1[_i];
                    if (t_points[0] < Min_x || t_points[0] > Max_x || t_points[1] < Min_y || t_points[1] > Max_y) {
                        continue;
                    }
                    if (map[t_points[2]][t_points[3]]) {
                        continue;
                    }
                    var t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id) {
                        tem_points.push([t_points[0], t_points[1]]);
                    }
                    else if (piece_set[t_p_id].p_faction != this.p_faction) {
                        tem_points.push([t_points[0], t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "p"://��
                var hill = false; //��Ҫ��ɽ��
                for (var t_x = this.m_x - 1; t_x >= Min_x; t_x--) {
                    var t_p_id = map[t_x][this.m_y];
                    if (hill) {
                        if (t_p_id) {
                            if (piece_set[t_p_id].p_faction != this.p_faction) {
                                tem_points.push([t_x, this.m_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }
                    else {
                        if (t_p_id) {
                            hill = true;
                        }
                        else {
                            tem_points.push([t_x, this.m_y]);
                        }
                    }
                }
                ;
                hill = false;
                for (var t_x = this.m_x + 1; t_x <= Max_x; t_x++) {
                    var t_p_id = map[t_x][this.m_y];
                    if (hill) {
                        if (t_p_id) {
                            if (piece_set[t_p_id].p_faction != this.p_faction) {
                                tem_points.push([t_x, this.m_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }
                    else {
                        if (t_p_id) {
                            hill = true;
                        }
                        else {
                            tem_points.push([t_x, this.m_y]);
                        }
                    }
                }
                ;
                hill = false;
                for (var t_y = this.m_y - 1; t_y >= Min_y; t_y--) {
                    var t_p_id = map[this.m_x][t_y];
                    if (hill) {
                        if (t_p_id) {
                            if (piece_set[t_p_id].p_faction != this.p_faction) {
                                tem_points.push([this.m_x, t_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }
                    else {
                        if (t_p_id) {
                            hill = true;
                        }
                        else {
                            tem_points.push([this.m_x, t_y]);
                        }
                    }
                }
                ;
                hill = false;
                for (var t_y = this.m_y + 1; t_y <= Max_y; t_y++) {
                    var t_p_id = map[this.m_x][t_y];
                    if (hill) {
                        if (t_p_id) {
                            if (piece_set[t_p_id].p_faction != this.p_faction) {
                                tem_points.push([this.m_x, t_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }
                    else {
                        if (t_p_id) {
                            hill = true;
                        }
                        else {
                            tem_points.push([this.m_x, t_y]);
                        }
                    }
                }
                ;
                break;
            case "x"://��
                var y_min = void 0;
                var y_max = void 0;
                if (this.p_faction == "r") {
                    y_min = r_minY;
                    y_max = r_maxY;
                }
                else {
                    y_min = b_minY;
                    y_max = b_maxY;
                }
                ;
                var possible_legpoints_xiang = [
                    [this.m_x + 2, this.m_y - 2, this.m_x + 1, this.m_y - 1],
                    [this.m_x + 2, this.m_y + 2, this.m_x + 1, this.m_y + 1],
                    [this.m_x - 2, this.m_y + 2, this.m_x - 1, this.m_y + 1],
                    [this.m_x - 2, this.m_y - 2, this.m_x - 1, this.m_y - 1],
                ];
                for (var _c = 0, possible_legpoints_xiang_1 = possible_legpoints_xiang; _c < possible_legpoints_xiang_1.length; _c++) {
                    var t_points = possible_legpoints_xiang_1[_c];
                    if (t_points[0] < Min_x || t_points[0] > Max_x || t_points[1] < y_min || t_points[1] > y_max) {
                        continue;
                    }
                    if (map[t_points[2]][t_points[3]]) {
                        continue;
                    }
                    var t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id) {
                        tem_points.push([t_points[0], t_points[1]]);
                    }
                    else if (piece_set[t_p_id].p_faction != this.p_faction) {
                        tem_points.push([t_points[0], t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "s"://��
                var _d = [0, 0, 0, 0], x_min_s = _d[0], x_max_s = _d[1], y_min_s = _d[2], y_max_s = _d[3];
                if (this.p_faction == "r") {
                    _e = [3, 5, 0, 2], x_min_s = _e[0], x_max_s = _e[1], y_min_s = _e[2], y_max_s = _e[3];
                }
                else {
                    _f = [3, 5, 7, 9], x_min_s = _f[0], x_max_s = _f[1], y_min_s = _f[2], y_max_s = _f[3];
                }
                ;
                var possible_landpoints_shi = [
                    [this.m_x + 1, this.m_y + 1],
                    [this.m_x + 1, this.m_y - 1],
                    [this.m_x - 1, this.m_y + 1],
                    [this.m_x - 1, this.m_y - 1],
                ];
                for (var _g = 0, possible_landpoints_shi_1 = possible_landpoints_shi; _g < possible_landpoints_shi_1.length; _g++) {
                    var t_points = possible_landpoints_shi_1[_g];
                    if (t_points[0] < x_min_s || t_points[0] > x_max_s || t_points[1] < y_min_s || t_points[1] > y_max_s) {
                        continue;
                    }
                    ;
                    var t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id) {
                        tem_points.push([t_points[0], t_points[1]]);
                    }
                    else if (piece_set[t_p_id].p_faction != this.p_faction) {
                        tem_points.push([t_points[0], t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "z"://��
                var forward_z = void 0; //��ʵ��������һ������ǰ������
                var cross_river = false; //�Ƿ�����
                if (this.p_faction == "r") {
                    //forward_z = (b_minY - r_maxY) / Math.abs(b_minY - r_maxY);
                    forward_z = 1;
                    if (this.m_y > r_maxY) {
                        cross_river = true;
                    }
                }
                else {
                    //forward_z = (r_maxY - b_minY) / Math.abs(r_maxY - b_minY);
                    forward_z = -1;
                    if (this.m_y < b_minY) {
                        cross_river = true;
                    }
                }
                ;
                var possible_landpoints_zu = void 0;
                if (cross_river) {
                    possible_landpoints_zu = [
                        [this.m_x, this.m_y + forward_z],
                        [this.m_x - 1, this.m_y],
                        [this.m_x + 1, this.m_y],
                    ];
                }
                else {
                    possible_landpoints_zu = [
                        [this.m_x, this.m_y + forward_z],
                    ];
                }
                ;
                for (var _h = 0, possible_landpoints_zu_1 = possible_landpoints_zu; _h < possible_landpoints_zu_1.length; _h++) {
                    var t_points = possible_landpoints_zu_1[_h];
                    if (t_points[0] < Min_x || t_points[0] > Max_x || t_points[1] < Min_y || t_points[1] > Max_y) {
                        continue;
                    }
                    ;
                    var t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id) {
                        tem_points.push([t_points[0], t_points[1]]);
                    }
                    else if (piece_set[t_p_id].p_faction != this.p_faction) {
                        tem_points.push([t_points[0], t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "j":
                var _j = [0, 0, 0, 0], x_min_j = _j[0], x_max_j = _j[1], y_min_j = _j[2], y_max_j = _j[3];
                if (this.p_faction == "r") {
                    _k = [3, 5, 0, 2], x_min_j = _k[0], x_max_j = _k[1], y_min_j = _k[2], y_max_j = _k[3];
                }
                else {
                    _l = [3, 5, 7, 9], x_min_j = _l[0], x_max_j = _l[1], y_min_j = _l[2], y_max_j = _l[3];
                }
                ;
                var possible_landpoints_jiang = [
                    [this.m_x + 1, this.m_y],
                    [this.m_x - 1, this.m_y],
                    [this.m_x, this.m_y + 1],
                    [this.m_x, this.m_y - 1],
                ];
                for (var _m = 0, possible_landpoints_jiang_1 = possible_landpoints_jiang; _m < possible_landpoints_jiang_1.length; _m++) {
                    var t_points = possible_landpoints_jiang_1[_m];
                    if (t_points[0] < x_min_j || t_points[0] > x_max_j || t_points[1] < y_min_j || t_points[1] > y_max_j) {
                        continue;
                    }
                    ;
                    var t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id) {
                        tem_points.push([t_points[0], t_points[1]]);
                    }
                    else if (piece_set[t_p_id].p_faction != this.p_faction) {
                        tem_points.push([t_points[0], t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                ;
                //˧�Խ�����
                if (this.p_faction == "r") {
                    for (var t_y = this.m_y + 1; t_y <= Max_y; t_y++) {
                        var t_p_id = map[this.m_x][t_y];
                        if (t_p_id) {
                            var t_p = piece_set[t_p_id];
                            if (t_p.p_role == "j") {
                                tem_points.push([this.m_x, t_y]);
                                tem_pieces.push(t_p_id);
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
                else {
                    for (var t_y = this.m_y - 1; t_y >= Min_y; t_y--) {
                        var t_p_id = map[this.m_x][t_y];
                        if (t_p_id) {
                            var t_p = piece_set[t_p_id];
                            if (t_p.p_role == "j") {
                                tem_points.push([this.m_x, t_y]);
                                tem_pieces.push(t_p_id);
                            }
                            else {
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
        var _e, _f, _k, _l;
    };
    LogicPiece.prototype.move = function (m_x, m_y) {
        this.m_x = m_x;
        this.m_y = m_y;
    };
    LogicPiece.prototype.kill_self = function () {
        this.living = false;
    };
    LogicPiece.prototype.revive_self = function () {
        this.living = true;
    };
    return LogicPiece;
}());
exports.LogicPiece = LogicPiece;
