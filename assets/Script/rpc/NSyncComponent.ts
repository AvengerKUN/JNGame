import SNGameAction from "../controller/server/SNGameAction";
import GAction from "../entity/action/GAction";
import GOwner from "../entity/GOwner";


export default abstract class NSyncComponent extends cc.Component {

    //权限
    //是否强制权限
    owner:boolean = false;
    //我对于这个Action的权限
    mOwner:number = 0;
    //他人对于这个Action的权限
    oOwner:number = 0;

    static OWNER_MAX:number = 9999999999;

    //最后服务器数据
    lastServerInfo:any = {};

    //检测时间差
    checkTime:number = 1/15;

    //时间+
    checkTimeData:number = 0;

    mindex:number = 0;

    //每帧检测值
    update(dt: number){

        if((this.checkTimeData += dt) > this.checkTime){
            let check = true;
            let uKeys = [];
            for(let key in this.lastServerInfo){
                let result = null;
                if(!this.eq(this.lastServerInfo[`${key}`],(result = this.keyValue(key)))){

                    check = false;
                    uKeys.push(key);
                    this.lastServerInfo[`${key}`] = result;

                }
            }

            if(!check){
                this.nUpCallBack(uKeys);
            }
            this.checkTimeData = 0;
        }

    }

    //更新值改动回调
    abstract nUpCallBack(keys);
    abstract uServerData(data);


    //添加需要同步的属性
    addSyncInfo(key:string){

        let val = null;
        if((val = this.keyValue(key))){
            this.lastServerInfo[`${key}`] = val;
            return true;
        }else{
            return false;
        }

    }

    //添加控制权方法
    addFunOwner(key:string){

        let that = this;

        let fun = this[key];

        this[key] = (...args) => {
            that.owner = true;
            let owner = new GOwner();
            owner.uid = that.node.name;
            SNGameAction.nGameSyncAuth(owner);

            fun.apply(that,args);
        }

        return true;
    }

    //判断是否拥有控制权
    isOwner(){
        return (this.owner || (this.mOwner > this.oOwner))
    }

    //传入key获取值
    keyValue(key:string):any{
        let vals = key.split('.');

        let result = this;
        for (let i in vals) {
            if(!(result = result[`${vals[i]}`])){
                return null;
            }
        }

        return result;
    }

    eq(a, b, aStack = null, bStack = null) {

        // === 结果为 true 的区别出 +0 和 -0
        if (a === b) return a !== 0 || 1 / a === 1 / b;
    
        // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
        if (a == null || b == null) return false;
    
        // 判断 NaN
        if (a !== a) return b !== b;
    
        // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    
        // 更复杂的对象使用 deepEq 函数进行深度比较
        return this.deepEq(a, b, aStack, bStack);
    };

    deepEq(a, b, aStack, bStack) {

        // a 和 b 的内部属性 [[class]] 相同时 返回 true
        var className = Object.prototype.toString.call(a);
        if (className !== Object.prototype.toString.call(b)) return false;
    
        switch (className) {
            case '[object RegExp]':
            case '[object String]':
                return '' + a === '' + b;
            case '[object Number]':
                if (+a !== +a) return +b !== +b;
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
        }
    
        var areArrays = className === '[object Array]';
        // 不是数组
        if (!areArrays) {
            // 过滤掉两个函数的情况
            if (typeof a != 'object' || typeof b != 'object') return false;
    
            var aCtor = a.constructor,
                bCtor = b.constructor;
            // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
            if (aCtor !== bCtor && !(this.isFunction(aCtor) && aCtor instanceof aCtor && this.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
    
    
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
    
        // 检查是否有循环引用的部分
        while (length--) {
            if (aStack[length] === a) {
                return bStack[length] === b;
            }
        }
    
        aStack.push(a);
        bStack.push(b);
    
        // 数组判断
        if (areArrays) {
    
            length = a.length;
            if (length !== b.length) return false;
    
            while (length--) {
                if (!this.eq(a[length], b[length], aStack, bStack)) return false;
            }
        }
        // 对象判断
        else {
    
            var keys = Object.keys(a),
                key;
            length = keys.length;
    
            if (Object.keys(b).length !== length) return false;
            while (length--) {
    
                key = keys[length];
                if (!(b.hasOwnProperty(key) && this.eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
    
        aStack.pop();
        bStack.pop();
        return true;
    }
    
    isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]'
    }
}
