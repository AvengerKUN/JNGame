
import axios from "./axios.js"

let http = axios.create({
    baseURL:"http://192.168.1.68:9190"
});

export const JGet = async (url,data = {}) => {
    let res = (await http.get(url,{data})).data;
    if ((typeof res) === "string"){
        console.log(res);
        res = eval(`(${res})`);
    }
    return res;
}

