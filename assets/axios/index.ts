
import axios from "./axios.js"

let http = axios.create({
    baseURL:"http://192.168.137.1:9190"
});

export const JGet = async (url,params = {}) => {
    let res = (await http.get(url,{params})).data;
    if ((typeof res) === "string"){
        console.log(res);
        res = eval(`(${res})`);
    }
    return res;
}

