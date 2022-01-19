

//获取url 参数
export const dGetUrlParams = (key) => {

    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    //返回参数
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null;
    }

}
