import React from 'react'
import { Upload, message, Button, Icon } from 'antd';
import {getItem} from "../../../util/localStorage";
import {IP} from "../../../Constants/ip";
import './style.less'
import {fetchGetPath} from "../../../fetch/labelUser";


class AddForm extends React.Component{
    constructor(props){
        super(props);
        this.downLoad = this.downLoad.bind(this)
    }

    downLoad(){
        let token = getItem("token");
        let result = fetchGetPath({},token);

        result.then(res=>{
            return res.json()
        }).then(res=> {
                let path = res.data
                window.location = IP + "/form/" + res.data  + "/downloadFile?projectId=" + this.props.id
            }
        )
    }

    render(){
        let token = getItem("token");
        const props = {
            name: 'file',
            action: IP + '/form/uploadForm',
            data:{
                projectId: this.props.id
            },
            headers: {
                authorization: token,
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    if (info.file.response.code == 0){
                        message.success(`${info.file.name} 上传成功`);
                    }else {
                        message.error(info.file.response.msg)
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                    message.error(info.file.response);
                }
            },
        };

        return(
            <div id="addForm">
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> 点击上传
                    </Button>
                </Upload>
                <Button style={{marginTop: "20px"}} onClick={()=>{this.downLoad()}}>
                    <Icon type="download" /> 点击下载文件
                </Button>
            </div>
        )
    }
}

export default AddForm;
