import React from 'react'
import { Button, Modal, Form, Input, Icon, Select, message, Menu, Layout } from 'antd';
import {fetchCreateProject, fetchAddProjectUser, fetchsearchProject} from "../../fetch/projectManage";
import {getItem} from "../../util/localStorage";
import AddUser from './AddUser'
import ManagaUser from './ManageUser'
import './style.less'

const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class AddProjectUserButton extends React.Component{
    constructor(props){
        super(props);
        this.getAddUserId = this.getAddUserId.bind(this);
        this.state = {
            visible: false,
            current: 'addUser',
            addUserId: [],
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    //确认按钮
    handleOk = (e) => {
        let token = getItem("token");
        // 添加人物确定
        if (this.state.current == "addUser"){
            if (this.state.addUserId != [] || this.state.addUserId != null){
                console.log(this.state.addUserId);
                let userForm = [];
                this.state.addUserId.map((value)=>{
                   userForm.push({projectId: this.props.data.id, userId: value})
                });
                console.log(userForm)
                let result = fetchAddProjectUser({
                    userProjectForms: userForm
                }, token);

                result.then(res=>{
                    return res.json()
                }).then(res=>{
                    if(res.code == 0){
                        message.info("人员添加成功！")
                        this.setState({
                            visible: false,
                            current: 'addUser',
                            addUserId: ''
                        })
                    }else {
                        message.error(res.msg)
                    }
                })
            }else {
                message.error("请选择要添加的用户")
            }
        }else if (this.state.current == "manageUser") {
            this.setState({
                visible: false
            })
        }
    };

    //取消按钮
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    //操作类型选择
    handleClick = (e) => {
        this.setState({
            current: e.key
        })

    };

    getAddUserId = (value) =>{
        this.setState({
            addUserId: value
        })
    };
    render(){
        return (
            <div id="addProjectUser">
                <Button type="primary" onClick={this.showModal}>
                    修改
                </Button>
                <Modal
                    title="人员修改"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Menu
                        mode="horizontal"
                        onClick={this.handleClick}
                        selectedKeys={[this.state.current]}
                        mode="horizontal"
                    >
                        <Menu.Item key="addUser">
                            <Icon type="" />添加人员
                        </Menu.Item>
                        <Menu.Item key="manageUser">
                            <Icon type="" />管理人员
                        </Menu.Item>
                    </Menu>
                    <Content>
                        {
                            this.state.current == "addUser"? <AddUser addFunc={this.getAddUserId}/> : <ManagaUser id={this.props.data.id}/>
                        }
                    </Content>
                </Modal>
            </div>
        )
    }
}
export default AddProjectUserButton
