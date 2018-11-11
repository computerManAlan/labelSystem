import React from 'react';
import { Table, Button, Spin, message, notification, Icon  } from 'antd';
import {fetchPackageProject, fetchGrabPackage, fetchGetPath} from "../../fetch/labelUser";
import {getItem} from "../../util/localStorage";
import LabelButton from '../LabelButton'
import {downLoad} from "../../fetch/downLoad";
import {IP} from "../../Constants/ip";



class LabelProjectTable extends React.Component{
    constructor(props){
        super(props);
        this.grabPackage = this.grabPackage.bind(this);
        this.downLoad = this.downLoad.bind(this);
        this.openNotification = this.openNotification.bind(this);
    }

    //数据下载
    downLoad(id){
        let token = getItem("token");
        let result = fetchGetPath({},token);

        result.then(res=>{
            return res.json()
        }).then(res=> {
                let path = res.data;
                window.location = IP + "/form/" + res.data  + "/downloadFile?projectId=" + id
            }
        )
    }

    //提示抓取数据成功
    openNotification(){
        notification.open({
            message: '抓取数据成功',
            description: '开始标注吧',
            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
        });
    };
    //抓取数据
    grabPackage(id){
        let token = getItem("token");
        let result = fetchGrabPackage({
            projectId: id
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                this.openNotification()
            } else {
                message.error(res.msg)
            }
        })
    }
    render(){
        const role = getItem("role");
        const columns = [{
            title: '项目ID',
            dataIndex: 'id',
            className: 'column-money',
        }, {
            title: '项目名称',
            dataIndex: 'name',
        }, {
            title: '是否有文本输入',
            dataIndex: 'hasText',
            render: (text, record) => {
                if (text == 0){
                    text = "否"
                } else {
                    text = "是"
                }
                return (
                   <div>{text}</div>
                )
            },
        },{
            title: '数据条数',
            dataIndex: 'dataNum',
        },{
            title: '数据包条数',
            dataIndex: 'packageNum',
        },{
            title: '检查数',
            dataIndex: 'checkNum',
        },{
            title: '状态',
            dataIndex: 'status',
            render: (text, record) => {
                switch(text){
                    case 0:
                        text = "未启动";
                        break
                    case 1:
                        text = "进行中";
                        break
                    case 2:
                        text = "已完成";
                        break;
                }
                return (
                    <div>{text}</div>
                )
            },
        }, {
            title: '抓取数据包',
            dataIndex: 'operate',
            render: (text, record) => {
                let isDisable = false;
                if (role != "1"){
                    isDisable = true
                }
                return (
                    <Button type="primary" disabled={isDisable} onClick={()=>{this.grabPackage(record.id)}}>抓取</Button>
                )
            },
        }, {
                title: '数据下载',
                dataIndex: 'operate',
                render: (text, record) => {
                    let isDisable = true;
                    if (role == "3"){
                        isDisable = false
                    }
                    return (
                        <Button disabled={isDisable}  onClick={()=>{this.downLoad(record.id)}}>
                            <Icon type="download" /> 点击下载文件
                        </Button>
                    )
                },
            }];

        let data = [];
        try{
            data = this.props.data.list;
        }catch (e) {
            console.log("sss")
        }

        return (
            <div id="labelProjectTable">
                <Spin spinning={this.props.isLoad}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered
                        pagination={false}
                        title={() => ''}
                    />
                </Spin>
            </div>
        )
    }
}
export default LabelProjectTable;
