import { Table, Dropdown, Button, Select, Radio, Pagination, Spin, Modal, message } from 'antd';
import React from 'react'
import { fetchResetPassword, updateTheUser, fetchDeleteUser } from '../../fetch/roleManage'
import './style.less'
import {getItem} from "../../util/localStorage";
import {fetchSelectProjectUser, fetchDeleteProjectUser} from "../../fetch/projectManage";



const Option = Select.Option;
const confirm = Modal.confirm;
class UserOfProjectTable extends React.Component{
    constructor(props){
        super(props);
        this.deleteUser = this.deleteUser.bind(this);
        this.getManageUser = this.getManageUser.bind(this);
        this.state = {
            tableData: ''
        }
    }

    componentDidMount(){
        this.getManageUser()
    }

    getManageUser(){
        let token = getItem("token");
        let result = fetchSelectProjectUser({
            projectId: this.props.id
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            this.setState({
                tableData: res.data
            });
            console.log(this.state.tableData)
        })
    }
    deleteUser(value){
        let token = getItem("token");
        let result = fetchDeleteProjectUser({
            projectId: this.props.id,
            userId: value.id
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                this.getManageUser()
            }else {
                message.error(res.msg)
            }

        })
    }
    render(){
        const columns = [{
            title: '名字',
            dataIndex: 'name',
        }, {
            title: '工号',
            dataIndex: 'empNum',
        }, {
            title: "角色",
            dataIndex: 'role',
            render: (text, record) => {
                let role = null
                switch (text){
                    case 0:
                        role = "未审核";
                        break;
                    case 1:
                        role = "标注员";
                        break;
                    case 2:
                        role = "质检员";
                        break;
                    case 3:
                        role = "验收员";
                        break;
                    case 4:
                        role = "管理员";
                        break;
                }
                return (
                    <div>{role}</div>
                );
            },
        },{
            title: '移除该用户',
            dataIndex: 'deleteUser',
            render: (text, record) => {
                return (
                    <div>
                        <Button type="danger" onClick={()=>{this.deleteUser(record)}}>移除该用户</Button>
                    </div>
                );
            },
        },];

        return(
            <div id="UserOfProjectTable">
                <Table columns={columns} dataSource={this.state.tableData} pagination={false} size="middle" />
            </div>
        )
    }
}
export default UserOfProjectTable;
