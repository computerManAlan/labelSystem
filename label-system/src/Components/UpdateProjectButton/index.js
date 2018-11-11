import React from 'react'
import { Button, Modal, Form, Input, Icon, Select, message } from 'antd';
import {fetchUpdateProject} from "../../fetch/projectManage";
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
            const { visible, onCancel, onCreate, form, data } = this.props;
            console.log("================")
            console.log(data)
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="修改项目"
                    okText="确认"
                    cancelText="取消"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        {/*名称*/}
                        <FormItem label="项目名称">
                            {getFieldDecorator('name',{ initialValue: data.name}, {
                                rules: [{ required: true, message: '请输入项目名称!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                            )}
                        </FormItem>
                        {/*检查数*/}
                        <FormItem label="项目检查数">
                            {getFieldDecorator('checkNum', { initialValue: data.checkNum},{
                                rules: [{
                                    validator: this.validateNumber
                                },{ required: true, message: '请输入项目检查数!' }],
                            })(
                                <Input prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                            )}
                        </FormItem>
                        {/*字数限制*/}
                        <FormItem label="字数限制数">
                            {getFieldDecorator('wordsNum', { initialValue: data.wordsNum},{
                                rules: [{
                                    validator: this.validateNumber
                                },{ required: true, message: '请输入字数限制数目!' }],
                            })(
                                <Input prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
                            )}
                        </FormItem>
                        {/*QQ*/}
                        <FormItem label="数据包条数">
                            {getFieldDecorator('packageNum', { initialValue: data.packageNum},{
                                rules: [{
                                    validator: this.validateNumber
                                },{ required: true, message: '请输入数据包条数!' }],
                            })(
                                <Input prefix={<Icon type="qq" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                            )}
                        </FormItem>
                        {/*角色*/}
                        <FormItem label="是否需要文本" >
                            {getFieldDecorator('hasText', { initialValue: data.hasText},{
                                rules: [{ required: true, message: '请选择是否要文本！' }],
                            })(
                                <Select
                                    placeholder={data.hasText}
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
        let token = getItem("token");
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            let {name, checkNum, packageNum, hasText, wordsNum} = values;
            if (hasText == "是"){
                hasText = 1
            } else if(hasText == "否"){
                hasText = 0
            }
            //提交给后端
            let result = fetchUpdateProject({
                name,
                checkNum,
                packageNum,
                hasText,
                wordsNum,
                id: this.props.data.id
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("更新成功！")
                    this.setState({ visible: false });
                    let page = this.props.page;
                    let type = this.props.type;
                    this.props.update(page, type)
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
        let data = this.props.data;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>修改</Button>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    data={data}
                />
            </div>
        );
    }
}
export default CollectionsPage
