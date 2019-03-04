import React from 'react'
import { Layout } from 'antd'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Form, Input, Tooltip, Icon, Row, Col, Button, message, Spin, notification } from 'antd';
import './style.less'
import   getVerifyCode  from '../../fetch/getVerifyCode/index';
import login from '../../fetch/login/index'
import { setItem, getItem } from "../../util/localStorage";
import { createHashHistory } from 'history'


const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
class Login extends React.Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.getVerifyCodeAction = this.getVerifyCodeAction.bind(this);
        this.changeVerifyCode = this.changeVerifyCode.bind(this);
        this.loginAction = this.loginAction.bind(this);
        this.state = {
            verifyCode: '',
            verifyCodeLoading: true
        }
    }

    componentDidMount(){
        let role = getItem("role");
        if (role == "1" || role=="2" || role=="3"){
            createHashHistory().push('/labelUser')
        } else if (role == "4"){
            createHashHistory().push('/manager')
        } else {
            this.getVerifyCodeAction();
        }
    }


    //登陆
    loginAction(value){
        let result = login({
            empNum: value.workNumber,
            password: value.passWord,
            verifyCode: value.verification
        });
        //清除本地缓存
        localStorage.clear();
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
                message.info("登陆成功!")
                let role = res.data.role;
                let token = res.data.token;
                // 将用户信息储存到本地
                setItem("role", role);
                setItem("token", token);
                if (getItem("role") == '4'){
                    createHashHistory().push('/manager')
                }else{
                    createHashHistory().push('/labelUser')
                }
            }
        })

    }

    //提交登陆
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.loginAction(values)
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

    render(){
        const { getFieldDecorator } = this.props.form;
        const verifyCode = this.state.verifyCode;
        return (
            <div id="login">
                <Layout>
                    <Header>
                        <span>登录</span>
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
                                {/*密码*/}
                                <FormItem>
                                    {getFieldDecorator('passWord', {
                                        rules: [{ required: true, message: '请输入您的密码!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
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
                                                <span style={{ verticalAlign: "top"}} onClick={this.changeVerifyCode}>
                                                    <img style={{verticalAlign: "top"}} alt='loading' title='click me to change one' src={`data:image/png;base64,${verifyCode}`}/>
                                                </span>
                                            </Spin>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
                                </FormItem>
                                <a className="login-form-forgot" onClick={()=>{ createHashHistory().push('/register')}}>没有账号？注册一个</a>
                                <a className="login-form-forgot" style={{float: "right"}} onClick={ ()=>{createHashHistory().push('/getPassword')}}>修改密码</a>
                            </Form>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <a href="http://www.miitbeian.gov.cn">
                            蜀ICP备18010275号-2
                        </a>
                    </Footer>
                </Layout>
            </div>
        )
    }
}

const LoginWrap  = Form.create()(Login);
export default LoginWrap
