
/*
    获取方法中的参数名
*/
export const uGetFunArgs = (func) => {
    // 先用正则匹配,取得符合参数模式的字符串.
    // 第一个分组是这个: ([^)]*) 非右括号的任意字符
    var args = "";
    try{
        args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    }catch{
        try{
            args = func.toString().match(/function\(([^)]*)\)/)[1];
        }catch{}
    }
    // 用逗号来分隔参数(arguments string).
    return args.split(",").map(function(arg) {
        // 去除注释(inline comments)以及空格
        return arg.replace(/\/\*.*\*\//, "").trim();
    }).filter(function(arg) {
        // 确保没有 undefined.
        return arg;
    });
}

/**
 * 
 * @param dt 
 * @returns 
 */
export const uDeepObjectCopy = (source: Object) => {
    const newObject = {};
    for (const key of Object.keys(source)) {
        newObject[key] = typeof source[key] === 'object' ? uDeepObjectCopy(source[key]) : source[key];
    }
    return newObject;
}

export const uWait = (dt) => {
    return new Promise((resolve) => {
        setTimeout(resolve,dt)
    })
}
