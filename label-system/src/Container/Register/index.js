import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Layout, Form, Input, Tooltip, Icon, Row, Col, Button, message, Spin, notification } from 'antd';
import { HashRouter } from 'react-router-dom';
import './style.less'
import  register from '../../fetch/register/index';
import  getVerifyCode from '../../fetch/getVerifyCode/index'
import { createHashHistory } from 'history'


const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
class Register extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.getVerifyCodeAction = this.getVerifyCodeAction.bind(this);
        this.validateCheckPassWord = this.validateCheckPassWord.bind(this);
        this.validateQQNumber = this.validateQQNumber.bind(this);
        this.validateTeleNumber = this.validateTeleNumber.bind(this);
        this.changeVerifyCode = this.changeVerifyCode.bind(this);
        this.registerAction = this.registerAction.bind(this);
        this.state = {
            verifyCode: '',
            verifyCodeLoading: false
        }
    }

    componentDidMount(){
        this.getVerifyCodeAction()
    }

    //注册
    registerAction(value){
        let result = register({
            name: value.userName,
            empNum: value.workNumber,
            qqNum: value.QQNumber,
            phoneNum: value.teleNumber,
            password: value.passWord,
            checkPass: value.checkPassWord,
            verifyCode: value.verification
        })

        result.then(res=>{
            if (res.status===502) {
                message.error('502 Bad Gatway');
            } else if(res.status===500) {
                message.error('500 服务器内部错误');
            } else if(res.status===403) {
                message.error('邮箱已經被注册,请更换过后再试');
            } else{
                return res.json()
            }
        }).then(res=>{
            if (res.code == 509){
                message.error(res.msg);
                this.props.form.setFields({
                    verification: {
                        value: '',
                        errors: [new Error('验证码错误!')],
                    },
                });
                this.getVerifyCodeAction()
            }else if(res.code == 0){
                //注册成功
                message.info("请等待审核验证!");
                this.getVerifyCodeAction();
                createHashHistory().push('/login')
            }else if(res.code == 501){
                message.error(res.msg);
                this.props.form.setFields({
                    workNumber: {
                        value: '',
                        errors: [new Error('该工号已被注册!')],
                    },
                });
                this.getVerifyCodeAction()
            }else{
                message.error("服务器未知错误");
                this.getVerifyCodeAction()
            }
        });

    }

    //提交信息注册
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.registerAction(values);
            }
        });
    };

    //获取验证码
    getVerifyCodeAction(){
        this.setState({
            verifyCodeLoading: true,
        });
        let result = getVerifyCode();
        result.then(res=>{
            if (res.ok){
                return res.text()
            }
        }).then(res=>{
            //获取图片编码
            res = JSON.parse(res);
            let verifyCode = res.data;
            this.setState({
                verifyCode: verifyCode,
                verifyCodeLoading: false
            })
        })
    };

    //切换验证码
    changeVerifyCode(){
        this.getVerifyCodeAction()
    }
    //qq号验证
    validateQQNumber(rule, value, callback){
        const form = this.props.form;
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

    //判断输入密码是否相同
    validateCheckPassWord(rule, value, callback){
        const form = this.props.form;
        if (value && value !== form.getFieldValue('passWord')) {
            callback('两次输入的密码不相同');
        } else {
            callback();
        }
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const verifyCode = this.state.verifyCode;
        return (
            <div id="register">
                <Layout>
                    <Header>
                        <span>注册</span>
                    </Header>
                    <Content>
                        <div className="informationEntry-container">
                            <Form onSubmit={this.handleSubmit} className="login-form">
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
                                {/*密码*/}
                                <FormItem>
                                    {getFieldDecorator('passWord', {
                                        rules: [{ required: true, message: '请输入您的密码!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                                    )}
                                </FormItem>
                                {/*确认密码*/}
                                <FormItem>
                                    {getFieldDecorator('checkPassWord', {
                                        rules: [{
                                            validator: this.validateCheckPassWord
                                        },{ required: true, message: '请确认您的密码!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认密码" />
                                    )}
                                </FormItem>
                                {/*验证码*/}
                                <FormItem>
                                    {getFieldDecorator('verification', {
                                            rules: [{
                                                message: '输入的不是正确的验证码',
                                            },{
                                                required: true,
                                                message: '请输入正确的验证码',
                                            }]
                                        })(
                                            <div>
                                                <Input style={{ width: '40%', marginRight: '12px', float: 'left'}} placeholder='输入你的验证码'/>
                                                <Spin spinning={this.state.verifyCodeLoading}>
                                                    <span style={{ width: '20%'}} onClick={this.changeVerifyCode}>
                                                        <img style={{ verticalAlign: "top"}} alt='loading' title='click me to change one' src={`data:image/png;base64,${verifyCode}`}/>
                                                    </span>
                                                </Spin>
                                            </div>

                                        )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Content>
                    <Footer></Footer>
                </Layout>
            </div>
        )
    }
}

const RegisterWrap  = Form.create()(Register);
export default RegisterWrap
