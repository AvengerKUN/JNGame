
import axios from "./axios.js"

let http = axios.create({
    baseURL:"http://106.53.124.8:9190"
});

export const JGet = async (url,data,info = {}) => {
    let res = (await http.get(url,data,info)).data;
    if ((typeof res) === "string"){
        console.log(res);
        res = eval(`(${res})`);
    }
    return res;
}

