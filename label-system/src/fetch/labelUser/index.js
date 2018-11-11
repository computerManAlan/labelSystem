import post from '../post';
import get from '../get';
import {IP} from "../../Constants/ip";
//获得项目
export function fetchPackageProject( body='',  token='', verify='',) {
    const url = IP + '/project/allOfUser';
    const result = get(url, body, token, verify );
    return result;
}

//抓取数据操作
export function fetchGrabPackage( body='',  token='', verify='',) {
    const url = IP + '/package/grab';
    const result = get(url, body, token, verify );
    return result;
}

//抓取数据包
export function fetchAllPackage( body='',  token='', verify='',) {
    const url = IP + '/package/allOfUser';
    const result = get(url, body, token, verify );
    return result;
}

//抓取标注的信息
export function fetchLabelPackage( body='',  token='', verify='',) {
    const url = IP + '/data/rowStatus';
    const result = get(url, body, token, verify );
    return result;
}
//展示一条数据进行标注
export function fetchLabelOnePackage( body='',  token='', verify='',) {
    const url = IP + '/data/showOneData';
    const result = get(url, body, token, verify );
    return result;
}
//标注回答
export function fetchAnswerData( body='',  token='', verify='',) {
    const url = IP + '/data/answerData';
    const result = post(url, body, token, verify );
    return result;
}
//更新回答
export function fetchUpdateAnswer( body='',  token='', verify='',) {
    const url = IP + '/data/updateAnswer';
    const result = post(url, body, token, verify );
    return result;
}
//打回标注数据包
export function fetchBackLabel( body='',  token='', verify='',) {
    const url = IP + '/package/repulseToRemark';
    const result = get(url, body, token, verify );
    return result;
}
//打回审核数据包
export function fetchBackCheck( body='',  token='', verify='',) {
    const url = IP + '/package/repulseToCheck';
    const result = get(url, body, token, verify );
    return result;
}
//提交至审核
export function fetchSendToCheck( body='',  token='', verify='',) {
    const url = IP + '/package/commitToCheck';
    const result = get(url, body, token, verify );
    return result;
}
//提交至验收
export function fetchSendToExam( body='',  token='', verify='',) {
    const url = IP + '/package/commitToExam';
    const result = get(url, body, token, verify );
    return result;
}
//验收通过
export function fetchPassExam( body='',  token='', verify='',) {
    const url = IP + '/package/passExam';
    const result = get(url, body, token, verify );
    return result;
}
//判断问题正误的
export function fetchChangeAnswerStatus(body='',  token='', verify='',) {
    const url = IP + '/data/changeAnswerStatus';
    const result = post(url, body, token, verify );
    return result;
}
//下载文件
export function fetchGetPath(body='',  token='', verify='',) {
    const url = IP + '/form/getPath';
    const result = get(url, body, token, verify );
    return result;
}
//添加问答文本框
export function answerDataForm(body='',  token='', verify='',) {
    const url = IP + '/answerData/addAnswerData';
    const result = post(url, body, token, verify );
    return result;
}
//更新添加文本框
export function updateAnswerDataForm(body='',  token='', verify='',) {
    const url = IP + '/answerData/updateAnswerData';
    const result = post(url, body, token, verify );
    return result;
}
