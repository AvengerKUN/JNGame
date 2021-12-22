
import axios from "./axios.js"

let http = axios.create({
    baseURL:"http://localhost:9190"
});

export const JGet = async (url,data) => {
    let res = (await http.get(url,{data})).data;
    if ((typeof res) === "string"){
        console.log(res);
        res = eval(`(${res})`);
    }
    return res;
}

