import React from 'react'
import { Button, Modal, Form, Input, Icon, Select, message} from 'antd';
import {fetchCreateProject} from "../../fetch/projectManage";
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
        }
        //数字验证
        validateNumber(rule, value, callback){
            if (value && isNaN(value)) {
                callback("请输入正确的数字")
            }else {
                callback();
            }
        };


        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;

            return (
                <Modal
                    visible={visible}
                    title="添加项目"
                    okText="确认"
                    cancelText="取消"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        {/*名称*/}
                        <FormItem>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入项目名称!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="名称" />
                            )}
                        </FormItem>
                        {/*检查数*/}
                        <FormItem>
                            {getFieldDecorator('checkNum', {
                                rules: [{
                                    validator: this.validateNumber
                                },{ required: true, message: '请输入项目检查数!' }],
                            })(
                                <Input prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="检查数" />
                            )}
                        </FormItem>
                        {/*字数限制数量*/}
                        <FormItem>
                            {getFieldDecorator('wordsNum', {
                                rules: [{
                                    validator: this.validateNumber
                                },{ required: true, message: '请输入字数限制的条数!' }],
                            })(
                                <Input prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="字数限制条数" />
                            )}
                        </FormItem>
                        {/*QQ*/}
                        <FormItem>
                            {getFieldDecorator('packageNum', {
                                rules: [{
                                    validator: this.validateNumber
                                },{ required: true, message: '请输入数据包条数!' }],
                            })(
                                <Input prefix={<Icon type="qq" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="数据包条数" />
                            )}
                        </FormItem>
                        {/*角色*/}
                        <FormItem>
                            {getFieldDecorator('hasText', {
                                rules: [{ required: true, message: '请选择是否要文本！' }],
                            })(
                                <Select
                                    placeholder="选择是否要文本"
                                    onChange={this.handleSelectChange}
                                >
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
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
            let token = getItem("token");
            //提交给后端
            let result = fetchCreateProject(values, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("添加成功")
                    this.setState({ visible: false });
                    this.props.update(this.props.currentPage, this.props.type)
                }else {
                    message.error(res.msg)
                }
            });

            form.resetFields();
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>添加项目</Button>
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
