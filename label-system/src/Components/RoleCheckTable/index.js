import { Table, Dropdown, Button, Select, Radio, Pagination, Spin, Modal, message } from 'antd';
import React from 'react'
import { fetchResetPassword, updateTheUser, fetchDeleteUser } from '../../fetch/roleManage'
import './style.less'
import {getItem} from "../../util/localStorage";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as userInfoActionsFromOtherFile from '../../Action/setRole';

const Option = Select.Option;
const confirm = Modal.confirm;


class RoleCheckTable extends React.Component{
    constructor(props){
        super(props);
        this.showRoleChangeModal = this.showRoleChangeModal.bind(this);
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //设置当前值
        this.state = {
            roleChoose: '质检员',
            data: null
        };
    }


    //修改权限选择
    handleChange(value) {
        this.setState({
            roleChoose: value
        });
    }

    //更新用户信息--权限修改
    showRoleChangeModal(record){
        let token = getItem("token");
        var _this = this
        function roleChange(record){
            let role = null;
            let roleChoose = _this.state.roleChoose;
            switch (roleChoose){
                case "标注员":
                    role = 1;
                    break;
                case "质检员":
                    role = 2;
                    break;
                case "验收员":
                    role = 3;
                    break;
            }
            let userUpdateForm = Object.assign(record, {role: role});

            let result = updateTheUser(userUpdateForm,token);
            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("修改成功");
                    let currentPage = _this.props.page;
                    let pagniationType = _this.props.type;
                    _this.props.update(currentPage, pagniationType)
                } else {
                    message.error("修改失败")
                }
            })
        }
        confirm({
            title: `将${record.name}的权限设置为?`,
            content: (
                <Select defaultValue={this.state.roleChoose} style={{ width: 120 }} onChange={this.handleChange}>
                    <Option value="标注员">标注员</Option>
                    <Option value="质检员">质检员</Option>
                    <Option value="验收员">验收员</Option>
                </Select>
            ),
            onOk() {
                roleChange(record)
            },
            onCancel() {},
        });
    }

    //删除用户
    showDeleteModal(record){
        let token = getItem("token");
        var _this = this
        function deleteUser(record){
            let result = fetchDeleteUser({
                id: record.id
            },token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("删除成功")
                    let currentPage = _this.props.page;
                    let pagniationType = _this.props.type;
                    _this.props.update(currentPage, pagniationType)
                } else {
                    message.error("删除失败")
                }
            })
        }
        confirm({
            title: `确认删除${record.name}?`,
            content: '删除后，无法撤回!!!!!!!!!!!',
            onOk() {
                deleteUser(record)
            },
            onCancel() {},
        });
    }
    //重置密码
    showResetModal(record){
        let token = getItem("token");
        function resetPassword(record){
            let result = fetchResetPassword({
                userId: record.id
            },token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("重置成功")
                } else {
                    message.error("重置失败")
                }
            })
        }
        confirm({
            title: `确认重置${record.name}的密码?`,
            content: '重置后，无法撤回!!!!!!!!!!!',
            onOk() {
                resetPassword(record)
            },
            onCancel() {},
        });
    }

    render(){
        //---------------------------
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '工号',
            className: 'column-money',
            dataIndex: 'empNum',
        }, {
            title: '电话号码',
            dataIndex: 'phoneNum',
        },{
            title: 'QQ号码',
            dataIndex: 'qqNum',
        },{
            title: '人物角色',
            dataIndex: 'role',
            render: (text, record) => {
                let role = text;
                let id  = record.id;
                let value = '';
                if (role == 1){
                    value = "标注员"
                }else if (role == 2){
                    value = "质检员"
                }else if (role == 3){
                    value = "验收员"
                }else if (role == 4){
                    value = "管理员"
                }else if (role == 0){
                    value = "未审核用户"
                }

                return (
                    <div>
                        {value}
                    </div>
                );
            },
        },{
            title: '权限修改',
            dataIndex: 'submit',
            render: (text, record) => {
                return (
                    <Button type="primary" onClick={()=>{this.showRoleChangeModal(record)}}>修改</Button>
                );
            },
        },{
            title: '重置密码',
            dataIndex: 'changePasswd',
            render: (text, record) => {
                return (
                    <div>
                        <Button type="primary" onClick={()=>{this.showResetModal(record)}}>重置密码</Button>
                    </div>
                );
            },
        },{
            title: '删除该用户',
            dataIndex: 'deleteUser',
            render: (text, record) => {
                return (
                    <div>
                        <Button type="danger" onClick={()=>{this.showDeleteModal(record)}}>删除该用户</Button>
                    </div>
                );
            },
        },
        ];
        //---------------------------
        let tableData = []
        try{
            tableData = this.props.data.list;
        }catch (e) {
            console.log("ss")
        }
        return(
            <div id="roleCheckTable">
                <Spin spinning={this.props.isLoad}>
                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={tableData}
                        bordered
                    />
                </Spin>
            </div>
        )
    }
}
export default RoleCheckTable
