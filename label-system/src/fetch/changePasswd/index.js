import post from '../post';
import {IP} from "../../Constants/ip";

//修改密码
export default function changePasswd( body='',  token='', verify='',) {
    const url = IP + '/anon/changePassword';
    const result = post(url, body, token, verify );
    return result;
}



