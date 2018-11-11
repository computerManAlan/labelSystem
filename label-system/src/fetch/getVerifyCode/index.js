import get from "../get";
import {IP} from "../../Constants/ip";
//获取验证码
export  default function getVerifyCode() {
    let url = IP + '/anon/sendVerifyCode';
    let result = get(url);
    return result;
}
