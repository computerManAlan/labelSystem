import get from "../get";
import post from "../post";
import { IP } from '../../Constants/ip'

//初始化获取项目信息，包含分页
export  function fetchGetAllPackage(params, token) {
    let url = IP + '/package/allOfProject';
    let result = get(url, params, token);
    return result;
}
//释放数据包
export  function fetchReleasePackage(params, token) {
    let url = IP + '/package/releasePackage';
    let result = get(url, params, token);
    return result;
}
