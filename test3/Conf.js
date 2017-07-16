var Conf={
	localhost:'192.168.1.102',	//本机ip可以为'localhost' '192.168.1.106'
	localport:2357,	//本机要用的端口
	Users:{		//用户名密码等信息现在简化处理就明文密码了,若是正规这个应放数据库里
		'0001':{
			'id':'0001',
			'pw':'1234',
			'name':'User1',
		},
		'0002':{
			'id':'0002',
			'pw':'2234',
			'name':'User2',
		},
		'0003':{
			'id':'0003',
			'pw':'3234',
			'name':'User3',
		},
	},
	cookie_exp:7603200,	//cookie通常最大存活时间，秒单位,88天
	access_token_exp:86400,	//token的生存时间，秒单位,1天.这里只有access没有fresh token
	encryption_algorithm:"HS256",	//加密算法
	secret_key:"*&tyi%doit",	//用于token加密解密的密钥，这里对称加密固一个密钥即可
};
module.exports = Conf;
