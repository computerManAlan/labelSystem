import post from '../post';
import {IP} from "../../Constants/ip";
//登陆
export default function login( body='',  token='', verify='',) {
    const url = IP + '/anon/login';
    const result = post(url, body, token, verify );
    return result;
}



