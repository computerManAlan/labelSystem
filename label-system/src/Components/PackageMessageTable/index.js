import { Table, Dropdown, Button, Select, Radio, Pagination, Spin, Modal, message } from 'antd';
import React from 'react'
import { fetchResetPassword, updateTheUser, fetchDeleteUser } from '../../fetch/roleManage'
import './style.less'
import {getItem} from "../../util/localStorage";
import {fetchReleasePackage} from "../../fetch/packageManage";
import {getLocalTime} from "../../Static/js";

const Option = Select.Option;
const confirm = Modal.confirm;
class PackageMessageTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentPage: 1,
            visible: false
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = (record) => {
        let token = getItem("token");
        console.log(record)
        let result = fetchReleasePackage({
            packageId: record.id
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                message.info("释放成功")
                this.setState({
                    visible: false,
                });
            } else {
                message.error(`释放失败!${res.msg}`)
            }
        })
    };

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    render(){
        const columns = [{
            title: '数据包ID',
            dataIndex: 'id',
            className: 'column-money',
        }, {
            title: '项目名称',
            dataIndex: 'projectName',
        }, {
            title: '用户名字',
            dataIndex: 'username',
        },{
            title: '状态',
            dataIndex: 'status',
            render: (text, record) => {
                let status = null;
                let color = null;
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
                        <Button type="primary" style={{backgroundColor: color}}>{status}</Button>
                    </div>
                );
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
        },{
            title: '释放数据',
            dataIndex: 'update',
            render: (text, record) => {
                return (
                    <div>
                        <Button type="primary" onClick={this.showModal}>
                            确认
                        </Button>
                        <Modal
                            title="Basic Modal"
                            visible={this.state.visible}
                            onOk={()=>{this.handleOk(record)}}
                            onCancel={this.handleCancel}
                        >
                            <p>确认释放数据？</p>
                        </Modal>
                    </div>
                );
            },
        }];
        let tableData = [];
        try {
            tableData = this.props.data.list
        }catch (e) {
            console.log("a")
        }
        return(
            <div id="packageMessageTable">
                <Spin spinning={this.props.isLoad}>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        bordered
                        pagination={false}
                    />
                </Spin>
            </div>
        )
    }
}
export default PackageMessageTable;
