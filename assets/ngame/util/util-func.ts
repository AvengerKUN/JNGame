
/*
    获取方法中的参数名
*/
export const uGetFunArgs = (func) => {
    if(typeof func !== 'function') return [];
    var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var code = func.toString().replace(COMMENTS, '');
    var result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
    .match(/([^\s,]+)/g);
    return result === null
    ? []
    : result;
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

export const uIsNull = (value) => {
    return value == null || value == undefined;
}
