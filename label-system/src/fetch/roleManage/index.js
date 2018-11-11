import get from "../get";
import post from "../post";
import { IP } from "../../Constants/ip"

//初始化获取用户信息，包含分页
export  function getRoleList(params, token) {
    let url =  IP + '/user/all';
    let result = get(url, params, token);
    return result;
}

//按用户条件搜索
export  function getRoleListSelectByRandom(params, token) {
    let url = IP + '/user/selectByRandom';
    let result = get(url, params, token);
    return result;
}

//按角色搜索
export  function getRoleListSelectByRole(params, token) {
    let url = IP + '/user/selectByRole';
    let result = get(url, params, token);
    return result;
}

//重置密码
export  function fetchResetPassword(params, token) {
    let url = IP + '/user/resetPassword';
    let result = get(url, params, token);
    return result;
}
//更新用户信息
export  function updateTheUser(body='', token='') {
    const url = IP + '/user/update';
    const result = post(url, body, token);
    return result;
}
//删除该用户
export function fetchDeleteUser(body='', token=''){
    let url = IP + '/user/delete';
    let result = get(url, body, token);
    return result;
}
//添加用户
export function addUser(body='', token='') {
    let url = IP + '/user/add';
    let result = post(url, body, token);
    return result;
}
//工号搜索
export function selectByRandom(body='', token='') {
    let url = IP + '/user/selectAddByRandom';
    let result = get(url, body, token);
    return result;
}

