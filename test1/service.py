import Conf
import bottle
from bottle import Bottle,route,run,template,get,redirect,request,response,static_file,error
from bottle.ext.websocket import GeventWebSocketServer
from bottle.ext.websocket import websocket
import jwt
import time
#
Tpl_path='./Tpls'
if not Tpl_path in bottle.TEMPLATE_PATH:
    bottle.TEMPLATE_PATH.append(Tpl_path)
#
#######
w_showWebApp=Bottle()
for_WSexample1_users = set()   #用于WS实例
#bottle.debug(True)
#处理token验证函数
def check_token():  #检查token正确合法与否
    try:
        recrived_token=request.get_cookie('access_token')
        if recrived_token:
            info=jwt.decode(recrived_token,Conf.secret_key,Conf.encryption_algorithm)
            if info['exp']<time.time():    #过期
                redirect('/login')
            #返回有用信息，到比如模板用id等处理user显示,至于exp等就不传了
            return {'id':info['id'],'name':info['name']}
        else:
            redirect('/login')
    except:
        redirect('/login')
        return False
#
#根目录路由
@w_showWebApp.route('/:a_rootf')
def static_one_rootf(a_rootf):
    return static_file(a_rootf,root='./')
#静态js文件路由
@w_showWebApp.route('/Js/:a_js')
def static_one_jsf(a_js):
    return static_file(a_js,root='./Js/')
#游戏资源文件路由
@w_showWebApp.route('/assets/:a_asset')
def static_one_image(a_asset):
    return static_file(a_asset,root='./assets/')
@w_showWebApp.route('/assets/:a_folder/:a_asset')
def static_one_image(a_folder,a_asset):
    return static_file(a_asset,root='./assets/'+a_folder)
#
@w_showWebApp.error(404)
def deal_error404(error):
    return template('Error404')
#
@w_showWebApp.route('/dologin',method='POST')
def do_login():
    username = request.forms.get('username')
    password = request.forms.get('password')
    print ('get',username,password)
    #判断用户名密码是否正确
    if username in Conf.Users and Conf.Users[username]['pw']==password:  #这里的username在数据库(假设有)中对应的是id
        print (username,'允许登陆')
        #产生token
        t_payload={ #JWT标准中的载荷，实际有用信息的传输
            'id':username,  #注意传进来的username是user id
            'name':Conf.Users[username]['name'],    #用户名称，这才是真正意义的username
            'iat':int(time.time()),  #签发时间
            'exp':int(time.time())+Conf.access_token_exp    #过期时间
        }
        t_acess_token=jwt.encode(t_payload,Conf.secret_key,Conf.encryption_algorithm).decode('utf-8')
        response.set_cookie('access_token',t_acess_token,max_age=Conf.cookie_exp,path='/')  #将token存入cookie
        print (t_acess_token)
        #完成登陆跳转首页
        redirect('/index')
    else:
        redirect('/login')
#
@w_showWebApp.route('/')
def redirect_to_index():
    redirect('/index')
#
@w_showWebApp.route('/index')
def Index():
    UserInfo=check_token();
    return template('index',UserInfo=UserInfo)
#
@w_showWebApp.route('/:agame')
def agame(agame):
    try:
        return template(agame)
    except Exception as e:
        print ('route',agame,'cause error : ',e)
        return template('normal_one_game',game_name=agame)
#
#@w_showWebApp.get('/websocket', apply=[websocket])
@w_showWebApp.route('/forWSexample1', apply=[websocket])
def chat(ws):   #此路由仅用于WS实例1，注释记录暂保留问题已解决
    for_WSexample1_users.add(ws)
    while True: #现在发现的问题就是这里总是连着触发两次，第二次接受到内容为空。还不能说就为空，经debug是出现报错了 直接返回了空，具体是什么还不一定
        msg = ws.receive()  #能成功recived到东西,第二次没东西
        if msg is not None:
            for u in for_WSexample1_users:
                u.send(msg) #问题应该是出在这一部，肯定是没send出去又没报错.所以网页没有接收到message下面的print又输出了。其实是因为前面连着接收到两次这里也就send了两次，第一次应该没毛病第二次经debug，msg就为空了 没有send，问题应该在接收哪里。
                print ("haha",u,msg)
        else:
            print ('接受到的msg是None')
            break
    for_WSexample1_users.remove(ws)
#
run(w_showWebApp,host=Conf.localhost,port=Conf.localport,reloader=True,server=GeventWebSocketServer)
#run(w_showWebApp,host=Conf.localhost,port=Conf.localport)
