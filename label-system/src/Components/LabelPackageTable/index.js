import React from 'react';
import { Table, Button, Spin, message, notification, Icon  } from 'antd';
import {fetchPackageProject, fetchGrabPackage} from "../../fetch/labelUser";
import {getItem} from "../../util/localStorage";
import LabelButton from '../LabelButton'
import {getLocalTime} from "../../Static/js";
import './style.less'


class LabelProjectTable extends React.Component{
    constructor(props){
        super(props);
    }



    render(){
        let role = getItem("role");
        const columns = [{
            title: '数据包ID',
            dataIndex: 'id',
        },{
            title: '用户名字',
            dataIndex: 'username',
        },{
            title: '项目ID',
            dataIndex: 'projectId',
        },{
            title: '项目名字',
            dataIndex: 'projectName',
        },{
            title: '状态',
            dataIndex: 'status',
            render: (text, record) => {
                let status = null
                let color = null
                switch (text){
                    case 0:
                        status = "未完成";
                        color = "red";
                        break;
                    case 1:
                        status = "审核状态";
                        color = "#87d068";
                        break;
                    case 2:
                        status = "验收状态";
                        color = "#2db7f5";
                        break;
                    case 3:
                        status = "审核打回";
                        color = "#108ee9";
                        break;
                    case 4:
                        status = "验收打回";
                        color = "#2bd7f5";
                        break;
                    case 5:
                        status = "通过";
                        color = "green";
                        break;
                }
                return (
                    <div>
                        <Button type="primary" style={{backgroundColor: color, width: 100}}>{status}</Button>
                    </div>
                )
            },
        },{
            title: '开始时间',
            dataIndex: 'startTime',
            render: (text, record) => {
                text = String(text).substr(0,10);
                return (
                    <div>
                        {getLocalTime(parseInt(text))}
                    </div>
                );
            },
        },{
            title: '更新时间',
            dataIndex: 'updateTime',
            render: (text, record) => {
                text = String(text).substr(0,10);
                return (
                    <div>
                        {getLocalTime(parseInt(text))}
                    </div>
                );
            },
        }, {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                //权限管理是否能点击

                let status = record.status;
                let isDisable = false;
                let buttonName = null;
                if (role == '1'){
                    buttonName = "标注"
                    if (status==1||status==2||status==5){
                        isDisable = true;
                    }
                }else if(role == '2'){
                    buttonName = "质检"
                    if (status==0||status==3||status==2||status==5||status==4){
                        isDisable = true;
                    }
                }else if (role == '3'){
                    buttonName = "验收"
                    if (status==1||status==4||status==3 || status==0 || status==5){
                        isDisable = true;
                    }
                }else {
                    isDisable = true
                }
                console.log("sssss")
                console.log(buttonName)
                return (
                    <LabelButton data={record.id} isDisabled={isDisable} update={this.props.update} page={this.props.page} buttonName={buttonName}/>
                );
            },
        }];
        let data = [];
        try{
            data = this.props.data.list;
        }catch (e) {
            console.log("sss")
        }

        return (
            <div id="labelPackageTable">
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
