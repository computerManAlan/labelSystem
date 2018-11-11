import React from 'react'
import { Layout } from 'antd'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Form, Input, Tooltip, Icon, Row, Col, Button, message, Spin, notification } from 'antd';
import './style.less'
import   getVerifyCode  from '../../fetch/getVerifyCode/index';
import changePasswd from '../../fetch/changePasswd/index'
import { createHashHistory } from 'history'

const { Header, Footer, Sider, Content } = Layout;

const FormItem = Form.Item;
class GetPassword extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.getVerifyCodeAction = this.getVerifyCodeAction.bind(this);
        this.validateCheckPassWord = this.validateCheckPassWord.bind(this);
        this.validateCheckOldPassWord = this.validateCheckOldPassWord.bind(this);
        this.changePasswdAction = this.changePasswdAction.bind(this);
        this.state = {
            verifyCode: '',
            verifyCodeLoading: false
        }
    }

    componentDidMount(){
        this.getVerifyCodeAction()
    }


    //登陆
    changePasswdAction(value){
        let result = changePasswd({
            empNum: value.workNumber,
            newPassword: value.newPassWord,
            checkNewPassword: value.checkNewPassWord,
            password: value.oldPassWord,
            verifyCode: value.verification
        });

        result.then(resp=>{
            if (resp.status===502) {
                message.error('502 Bad Gatway');
            } else if(resp.status===500) {
                message.error('500 服务器内部错误');
            } else{
                return resp.json()
            }
        }).then(res=>{
            if (res.code == 515){
                message.error("该用户还在审核中!")
                this.props.form.setFields({
                    workNumber: {
                        value: '',
                        errors: [new Error('该用户正在审核中!')],
                    },
                });
                // 登录失败时更新验证码
                this.getVerifyCodeAction();
            }else if (res.code == 503){
                message.error("该用户不存在!")
                this.props.form.setFields({
                    workNumber: {
                        value: '',
                        errors: [new Error('该用户不存在!')],
                    },
                });
                // 登录失败时更新验证码
                this.getVerifyCodeAction();
            }else if(res.code == 512){
                message.error("验证码错误!")
                this.props.form.setFields({
                    verification: {
                        value: '',
                        errors: [new Error('验证码错误!')],
                    },
                });
                // 登录失败时更新验证码
                this.getVerifyCodeAction();
            }else if (res.code == 402){
                message.error("密码错误!")
                this.props.form.setFields({
                    passWord: {
                        value: '',
                        errors: [new Error('密码错误!')],
                    },
                });
                // 登录失败时更新验证码
                this.getVerifyCodeAction();
            }else if (res.code == 0){
                //登陆成功
                message.info("修改成功!")
                createHashHistory().push('/login')

            }else {
                message.error(res.msg)
            }
        })

    }

    //提交登陆
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.changePasswdAction(values)
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

    //判断输入密码是否相同
    validateCheckPassWord(rule, value, callback){
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassWord')) {
            callback('两次输入的密码不相同');
        } else {
            callback();
        }
    };
    //判断新密码与旧密码是否相同
    validateCheckOldPassWord(rule, value, callback){
        const form = this.props.form;
        if (value && value == form.getFieldValue('oldPassWord')) {
            callback('与旧密码相同');
        } else {
            callback();
        }
    }

    //切换验证码
    changeVerifyCode(){
        this.getVerifyCodeAction()
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const verifyCode = this.state.verifyCode;
        return (
            <div id="login">
                <Layout>
                    <Header>
                        <span>更改密码</span>
                    </Header>
                    <Content>
                        <div className="informationEntry-container">
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                {/*员工号*/}
                                <FormItem>
                                    {getFieldDecorator('workNumber', {
                                        rules: [{ required: true, message: '请输入您的员工号!' }],
                                    })(
                                        <Input prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="员工号" />
                                    )}
                                </FormItem>
                                {/*旧密码*/}
                                <FormItem>
                                    {getFieldDecorator('oldPassWord', {
                                        rules: [{ required: true, message: '请输入您的旧密码!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="旧密码" />
                                    )}
                                </FormItem>
                                {/*新密码*/}
                                <FormItem>
                                    {getFieldDecorator('newPassWord', {
                                        rules: [{
                                            validator: this.validateCheckOldPassWord
                                        },{ required: true, message: '请输入您的新密码!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="新密码" />
                                    )}
                                </FormItem>
                                {/*确认新密码*/}
                                <FormItem>
                                    {getFieldDecorator('checkNewPassWord', {
                                        rules: [{
                                            validator: this.validateCheckPassWord
                                        },{ required: true, message: '请确认您的新密码!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认新密码" />
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
                                        <Input style={{ width: '78%', marginRight: '12px'}} placeholder='输入你的验证码'/>

                                    )}
                                    <span style={{ width: '20%'}} onClick={this.changeVerifyCode}>
                                        <img alt='loading' title='click me to change one' src={`data:image/png;base64,${verifyCode}`}/>
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
                                </FormItem>
                                <a className="login-form-forgot"  onClick={()=>{createHashHistory().push('/register')}}>没有账号？注册一个</a>
                            </Form>
                        </div>
                    </Content>
                    <Footer></Footer>
                </Layout>
            </div>
        )
    }
}

const LoginWrap  = Form.create()(GetPassword);
export default LoginWrap
