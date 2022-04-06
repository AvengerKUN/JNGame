import { Prefab, resources, Vec3 } from "cc";


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

export function dLoadPrefab(url) {
    
    return new Promise<Prefab>((resolve) => {
        resources.load(url, Prefab, (err, prefab) => {
            resolve(prefab);
        });
    });

}

export function dVec3Retain(v3:Vec3,length:number = 20) : Vec3{

    try{
        v3 = new Vec3(
            parseInt(v3.x.toFixed(length)),
            parseInt(v3.y.toFixed(length)),
            parseInt(v3.z.toFixed(length))
        )
    }catch{}

    return v3;

}

