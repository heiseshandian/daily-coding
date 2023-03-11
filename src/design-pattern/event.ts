import { getSingleClass } from './singleton';
type Callback = (...args: any[]) => any;

type DefaultEventKey = string | number | symbol;

/* 
注意

模块之间如果用了太多的全局发布—订阅模式来通信，那么模块与模块之间的联系就被隐藏到了背后。
我们最终会搞不清楚消息来自哪个模块，或者消息会流向哪些模块，这又会给我们的维护带来一些麻烦，
也许某个模块的作用就是暴露一些接口给其他模块调用。
*/
export class EventBus<EventKey extends DefaultEventKey = DefaultEventKey> {
    clientList: Partial<Record<EventKey, Callback[]>> = {};

    listen(key: EventKey, fn: Callback) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }

        this.clientList[key]?.push(fn);

        // 如果存在离线消息就把之前的离线消息都发出去
        const paramsList = this.offlineEvents[key];
        if (paramsList && paramsList.length > 0) {
            paramsList.forEach((params) => {
                this.trigger(key, ...params);
            });

            paramsList.length = 0;
        }

        // 离线消息发完之后清空，避免再次接收到离线消息
        delete this.offlineEvents[key];
    }

    // 离线事件（比如说某个事件暂时还没订阅者，我们希望后面订阅的人可以收到之前发出的离线消息）
    offlineEvents: Partial<Record<EventKey, any[][]>> = {};

    trigger(key: EventKey, ...rest: any[]) {
        const fns = this.clientList[key];

        // 暂时没有订阅者就把消息先存在离线消息队列里
        if (!fns || fns.length === 0) {
            if (!this.offlineEvents[key]) {
                this.offlineEvents[key] = [];
            }

            this.offlineEvents[key]?.push(rest);
            return;
        }

        for (let i = 0; i < fns.length; i++) {
            fns[i].apply(this, rest);
        }
    }

    remove(key: EventKey, fn: Callback) {
        const fns = this.clientList[key];
        if (!fns || fns.length === 0) {
            return;
        }

        // 未传入fn说明需要取消key对应的所有订阅
        if (fn === undefined) {
            fns.length = 0;
        } else {
            // 这里特意使用反向遍历，否则删除一个元素的时候还要调整i的值
            for (let i = fns.length - 1; i >= 0; i--) {
                if (fns[i] === fn) {
                    fns.splice(i, 1);
                }
            }
        }
    }
}

/* 
具体实例

假如我们正在开发一个商城网站，网站里有header头部、nav导航、消息列表、购物车等模块。
这几个模块的渲染有一个共同的前提条件，就是必须先用ajax异步请求获取用户的登录信息。
这是很正常的，比如用户的名字和头像要显示在header模块里，而这两个字段都来自用户登录后返回的信息。

至于ajax请求什么时候能成功返回用户信息，这点我们没有办法确定。
现在的情节看起来像极了售楼处的例子，小明不知道什么时候开发商的售楼手续能够成功办下来。
但现在还不足以说服我们在此使用发布—订阅模式，因为异步的问题通常也可以用回调函数来解决。
更重要的一点是，我们不知道除了header头部、nav导航、消息列表、购物车之外，
将来还有哪些模块需要使用这些用户信息。如果它们和用户信息模块产生了强耦合，比如下面这样的形式：

​​​​​​​​​​login.succ(function(data){￼​​​​​​​​    
    header.setAvatar( data.avatar);   // 设置header模块的头像￼​​​​​​​​    
    nav.setAvatar( data.avatar );     // 设置导航模块的头像￼​​​​​​​​    
    message.refresh();                // 刷新消息列表￼​​​​​​​​    
    cart.refresh();                   // 刷新购物车列表￼
​​​​​​​​});​​

现在登录模块是我们负责编写的，但我们还必须了解header模块里设置头像的方法叫setAvatar、
购物车模块里刷新的方法叫refresh，这种耦合性会使程序变得僵硬，header模块不能随意再改变setAvatar的方法名，
它自身的名字也不能被改为header1、header2。
这是针对具体实现编程的典型例子，针对具体实现编程是不被赞同的。
*/

enum LoginEventType {
    LoginSuccess,
}

// login模块在信息请求成功的时候发布事件
// 使用发布订阅模式解除模块之间的强依赖
class Login extends EventBus {
    init() {
        // 请求数据，请求成功后发布消息
        this.trigger(LoginEventType.LoginSuccess, {
            // user info
        });
    }

    listen(key: LoginEventType, fn: Callback) {
        this.listen(key, fn);
    }
}

const getLoginInstance = getSingleClass(Login);

class Header {
    login: Login = getLoginInstance();

    init() {
        this.login.listen(LoginEventType.LoginSuccess, () => {
            // 根据Login模块传过来的用户信息做处理
        });
    }
}

class Address {
    login: Login = getLoginInstance();

    init() {
        this.login.listen(LoginEventType.LoginSuccess, () => {
            // 根据Login模块传过来的用户信息做处理
        });
    }
}
