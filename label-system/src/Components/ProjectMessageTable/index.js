import { Table, Dropdown, Button, Select, Radio, Pagination, Spin, Modal, message } from 'antd';
import React from 'react'
import { fetchResetPassword, updateTheUser, fetchDeleteUser } from '../../fetch/roleManage'
import './style.less'
import {getItem} from "../../util/localStorage";
import {fetchDeleteProject} from "../../fetch/projectManage";
import UpdateProjectButton from '../UpdateProjectButton';
import AddProjectUserButton from '../AddProjectUserButton';
import AddRuleButton from '../AddRuleButton'

const Option = Select.Option;
const confirm = Modal.confirm;
class ProjectMessageTable extends React.Component{
    constructor(props){
        super(props);
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.state = {
            currentPage: 1
        }
    }

    //删除项目
    showDeleteModal(record){
        let token = getItem("token");
        let _this = this;
        function deleteProject(record){
            let result = fetchDeleteProject({
                id: record.id
            },token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("删除成功")
                    let page = _this.props.page;
                    let type = _this.props.type;
                    _this.props.update(page, type)
                } else {
                    message.error(`删除失败!${res.msg}`)
                }
            })
        }
        confirm({
            title: `确认删除${record.name}该项目?`,
            content: '删除后，无法撤回!!!!!!!!!!!',
            onOk() {
                deleteProject(record)
            },
            onCancel() {},
        });
    }

    render(){
        console.log("-----------")
        console.log(this.props.data.list)
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
        },{
            title: '字数限制',
            dataIndex: 'wordsNum',
        },{
            title: '制定规则',
            dataIndex: 'update',
            render: (text, record) => {
                return (
                    <AddRuleButton data={record} update={this.props.update}  page={this.props.page} type={this.props.type}/>
                );
            },
        },{
            title: '项目信息修改',
            dataIndex: 'update',
            render: (text, record) => {
                return (
                    <UpdateProjectButton data={record} update={this.props.update} page={this.props.page} type={this.props.type}/>
                );
            },
        },{
            title: '修改项目人员',
                dataIndex: 'addPeople',
                render: (text, record) => {
                return (
                    <AddProjectUserButton data={record} update={this.props.update} page={this.props.page} type={this.props.type}/>
                );
            },
        },{
            title: '删除项目',
                dataIndex: 'delete',
                render: (text, record) => {
                return (
                    <Button type="danger" onClick={()=>{this.showDeleteModal(record)}}>删除</Button>
                );
            },
        }];
        let tableData = this.props.data.list;
        return(
            <div id="projectMessageTable">
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
export default ProjectMessageTable;
