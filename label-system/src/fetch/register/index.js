import post from '../post'
import {IP} from "../../Constants/ip";
//注册
export  default function register(body='', verify='', token='') {
    const url = IP + '/anon/register';
    const result = post(url, body, token, verify);
    return result;
}



