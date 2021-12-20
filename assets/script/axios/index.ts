
import axios from "./axios.js"

let http = axios.create({
    baseURL:"http://106.53.124.8:9190"
});

export const JGet = async (url,data) => {
    return (await http.get(url,data)).data;
}

