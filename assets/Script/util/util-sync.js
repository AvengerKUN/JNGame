export const delayTimeSync = (time) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        },time)
    })
};

export const delayImageSync = (path) => {
    return new Promise(resolve => {
        const image = new Image();
        image.src = path;
        image.onload = () => resolve(image);
    })
};

//await $nextTick
export const delayVueSync = (vue) => {
    return new Promise(resolve => {
        vue.$nextTick(
            () => {
                resolve()
            }
        )
    })
};

export const refsCheckForm = (ref) => { //多表单验证
    return new Promise((resolve,reject) => {

        if(ref){
            ref.validate(valid => {
                if(valid) resolve(ref); else reject(ref);
            })
        }
        resolve();
    });
};

export const loadGameMap = (mapName) => {

    return new Promise(resolve => {
        cc.director.preloadScene(mapName,resolve);
    })

}
