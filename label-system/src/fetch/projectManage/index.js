import get from "../get";
import post from "../post";
import { IP } from '../../Constants/ip'

//初始化获取项目信息，包含分页
export  function getProjectList(params, token) {
    let url = IP + '/project/all';
    let result = get(url, params, token);
    return result;
}

//删除项目
export  function fetchDeleteProject(params, token) {
    let url = IP + '/project/delete';
    let result = get(url, params, token);
    return result;
}

//搜索项目
export  function fetchsearchProject(params, token) {
    let url = IP + '/project/select';
    let result = get(url, params, token);
    return result;
}

//创建项目
export  function fetchCreateProject(params, token) {
    let url = IP + '/project/create';
    let result = post(url, params, token);
    return result;
}

//更新项目
export  function fetchUpdateProject(params, token) {
    let url = IP + '/project/update';
    let result = post(url, params, token);
    return result;
}
//添加项目用户
export  function fetchAddProjectUser(params, token) {
    let url = IP + '/userProject/add';
    let result = post(url, params, token);
    return result;
}
//查看项目参与的所有用户
export  function fetchSelectProjectUser(params, token) {
    let url = IP + '/userProject/selectUser';
    let result = get(url, params, token);
    return result;
}
//删除项目参与用户
export  function fetchDeleteProjectUser(params, token) {
    let url = IP + '/userProject/delete';
    let result = get(url, params, token);
    return result;
}
//获取所有表头
export function fetchGetAllTitle(params, token) {
    let url = IP + '/form/allHeaders';
    let result = get(url, params, token);
    return result;
}
//添加表头
export function fetchAddAllTitle(params, token) {
    let url = IP + '/form/addHeaders';
    let result = post(url, params, token);
    return result;
}
//删除表头
export function fetchDeleteHeader(params, token) {
    let url = IP + '/form/deleteHeader';
    let result = get(url, params, token);
    return result;
}
//获取项目选项
export function fetchGetChoices(params, token) {
    let url = IP + '/form/allChoices';
    let result = get(url, params, token);
    return result;
}
//添加选项
export function fetchAddChoices(params, token) {
    let url = IP + '/form/addChoices';
    let result = post(url, params, token);
    return result;
}
//删除选项
export function fetchDeleteChoice(params, token) {
    let url = IP + '/form/deleteChoice';
    let result = get(url, params, token);
    return result;
}
//添加回答问题的表头
export function fetchAddAnswerHeaders(params, token) {
    let url = IP + '/form/addAnswerHeaders';
    let result = post(url, params, token);
    return result;
}
//获取所有回答的表头
export function fetchAllAnswerHeaders(params, token) {
    let url = IP + '/form/allAnswerHeaders';
    let result = get(url, params, token);
    return result;
}
//删除回答表头
export function fetchDeleteAnswerHeaders(params, token) {
    let url = IP + '/form/deleteAnswerHeader';
    let result = get(url, params, token);
    return result;
}
//更新回答表头信息
export function fetchUpdateAnswerHeaders(params, token) {
    let url = IP + '/form/updateAnswerHeaders';
    let result = get(url, params, token);
    return result;
}
