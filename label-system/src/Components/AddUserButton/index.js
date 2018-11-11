import React from 'react'
import { Button, Modal, Form, Input, Icon, Select, message } from 'antd';
import {addUser, getRoleListSelectByRandom} from "../../fetch/roleManage";
import {getItem} from "../../util/localStorage";

const FormItem = Form.Item;
const Option = Select.Option;
const CollectionCreateForm = Form.create()(
    class extends React.Component {
        constructor(props){
            super(props);
            this.handleChange = this.handleChange.bind(this);
        }

        //修改权限选择
        handleChange(value) {
            this.setState({
                roleChoose: value
            });
            console.log(`selected ${value}`);
        }
        //qq号验证
        validateQQNumber(rule, value, callback){
            if (value && isNaN(value)) {
                callback("请输入正确的qq号")
            }else {
                callback();
            }
        };

        //电话验证
        validateTeleNumber(rule, value, callback){
            let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if (value && !myreg.test(value)){
                callback("请输入正确的手机号")
            } else {
                callback()
            }
        };
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;

            return (
                <Modal
                    visible={visible}
                    title="添加用户"
                    okText="确认"
                    cancelText="取消"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        {/*姓名*/}
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入您的姓名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="姓名" />
                            )}
                        </FormItem>
                        {/*员工号*/}
                        <FormItem>
                            {getFieldDecorator('workNumber', {
                                rules: [{ required: true, message: '请输入您的员工号!' }],
                            })(
                                <Input prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="员工号" />
                            )}
                        </FormItem>
                        {/*QQ*/}
                        <FormItem>
                            {getFieldDecorator('QQNumber', {
                                rules: [{
                                    validator: this.validateQQNumber
                                },{ required: true, message: '请输入您的QQ号!' }],
                            })(
                                <Input prefix={<Icon type="qq" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="QQ号" />
                            )}
                        </FormItem>
                        {/*电话*/}
                        <FormItem>
                            {getFieldDecorator('teleNumber', {
                                rules: [{
                                    validator: this.validateTeleNumber
                                },{ required: true, message: '请输入您的电话号码!' }],
                            })(
                                <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="电话号码" />
                            )}
                        </FormItem>
                        {/*角色*/}
                        <FormItem>
                            {getFieldDecorator('role', {
                                rules: [{ required: true, message: '请选择要添加的权限！' }],
                            })(
                                <Select
                                    placeholder="选择要添加的权限"
                                    onChange={this.handleSelectChange}
                                >
                                    <Option value="标注员">标注员</Option>
                                    <Option value="质检员">质检员</Option>
                                    <Option value="验收员">验收员</Option>
                                    <Option value="管理员">管理员</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

class CollectionsPage extends React.Component {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({ visible: true });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    //提交
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log(values)
            let role = null
            switch (values.role){
                case "标注员":
                    role = 1;
                    break;
                case "质检员":
                    role = 2;
                    break;
                case "验收员":
                    role = 3;
                    break;
                case "管理员":
                    role = 4;
                    break;
            }
            let token = getItem("token");
            //提交给后端
            let result = addUser({
                empNum: values.workNumber,
                name: values.userName,
                phoneNum: values.teleNumber,
                qqNum: values.QQNumber,
                role: role

            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("添加成功")
                    this.setState({ visible: false });
                    this.props.update(1,'all')
                }else {
                    message.error(res.msg)
                }
            });

            form.resetFields();
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>添加用户</Button>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}
export default CollectionsPage
