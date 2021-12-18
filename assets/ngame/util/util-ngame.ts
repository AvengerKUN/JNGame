

/**
* 同步随机函数
* @param {number} [max=1]
* @param {number} [min=0]
* @returns
* @memberof CyEngine
*/
export const newReededRandom = (seed) => {
    return (max = 1, min = 0) => {
        seed = (seed * 9301 + 49297) % 233280;
        let rnd = seed / 233280.0;
        return min + rnd * (max - min);
    }
}
