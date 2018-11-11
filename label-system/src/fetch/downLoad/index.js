import get from "../get";
import {IP} from "../../Constants/ip";
//获取验证码
export  function downLoad(params, token) {
    let url = IP + '/form/downloadFile';
    let result = get(url,params, token);
    return result;
}
