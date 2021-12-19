
import axios from "./axios.js"

let http = axios.create({
    baseURL:"http://192.168.1.166:9190"
});

export const JGet = async (url,data) => {
    return (await http.get(url,data)).data;
}

