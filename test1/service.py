import Conf
import bottle
from bottle import Bottle,route,run,template,get,redirect,request,response,static_file,error
from bottle.ext.websocket import GeventWebSocketServer
from bottle.ext.websocket import websocket
#
Tpl_path='./Tpls'
if not Tpl_path in bottle.TEMPLATE_PATH:
    bottle.TEMPLATE_PATH.append(Tpl_path)
#
#######
w_showWebApp=Bottle()
users = set()   #用于WS实例
#bottle.debug(True)
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
@w_showWebApp.route('/')
def redirect_to_index():
    redirect('/index')
#
@w_showWebApp.route('/index')
def Index():
    return template('index')
#
@w_showWebApp.route('/:agame')
def Index(agame):
    try:
        return template(agame)
    except:
        return template('normal_one_game',game_name=agame)
#
#@w_showWebApp.get('/websocket', apply=[websocket])
@w_showWebApp.route('/websocket', apply=[websocket])
def chat(ws):
    users.add(ws)
    while True: #现在发现的问题就是这里总是连着触发两次，第二次接受到内容为空
        msg = ws.receive()
        if msg is not None:
            for u in users:
                u.send(msg)
                print ("haha",u,msg)
        else:
            break
        print ('11111111')
    users.remove(ws)
#
run(w_showWebApp,host=Conf.localhost,port=Conf.localport,reloader=True,server=GeventWebSocketServer)
