import { Table,Radio, List, Button, Input, message, Icon, Form } from 'antd';
import React from 'react'
import {fetchAnswerData, fetchUpdateAnswer, answerDataForm, updateAnswerDataForm} from "../../fetch/labelUser";
import {getItem} from "../../util/localStorage";
import {fetchChangeAnswerStatus} from "../../fetch/labelUser";
import './style.less'

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const columns = [{
    title: '表头',
    dataIndex: 'name',
    render: text => <a href="javascript:;">{text}</a>,
}, {
    title: '内容',
    dataIndex: 'content',
}];

//需求改的次数多，需要重构
class QuestionTable extends React.Component{
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
        this.submitChoose = this.submitChoose.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.handleCorrect = this.handleCorrect.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateExceedNumber  = this.validateExceedNumber.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.updateAnswer = this.updateAnswer.bind(this);
        this.state = {
            inputMessage: '',
            chooseId: null,
            answerId: null,
            //判断是更新还是提交,默认提交，点击之后更新
            handleFlag: true,

        }
    }

    componentDidMount(){
        //以前答案的展示
        let inputMessage = null;
        let answerId = null;
        let choiceId = null;
        try {
            inputMessage = this.props.data.answer.description
            answerId = this.props.data.answer.id;
            choiceId = this.props.data.answer.choiceId
        }catch (e) {
            console.log("sss")
        }

        this.setState({
            inputMessage: inputMessage,
            chooseId: choiceId,
            answerId: answerId
        })
    }

    //提交正确状态
    handleCorrect(){
        let token = getItem("token");
        let result = fetchChangeAnswerStatus({
            answerId: this.state.answerId,
            status: 1
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                message.info("提交成功")
            }else {
                message.error(res.msg)
            }

        })
    }

    //提交错误状态
    handleError(){
        let token = getItem("token");
        let result = fetchChangeAnswerStatus({
            answerId: this.state.answerId,
            status: 2
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                message.info("提交成功")

            }else {
                message.error(res.msg)
            }

        })
    }

    //选择框绑定
    onChange = (e) => {
        this.setState({
            chooseId: e.target.value,
        });
    };

    //更新标注后的信息
    updateQuestion({wordsNum}){
        //有文本
        let hasText = this.props.data.hasText;
        let token = getItem("token");
        if (wordsNum == -1){
            wordsNum = 1000000;
        }
        if (this.state.chooseId == null){
            //判断选择框是否被选择
            message.error("请输入选项!")
        }
        if(hasText != 0 && this.state.inputMessage){
            if (this.state.inputMessage.length > wordsNum){
                message.error(`超出字数限制，最多输入${wordsNum}个字！`)
            }
        }else{
            let result = fetchUpdateAnswer({
                choiceId: this.state.chooseId,
                description: this.state.inputMessage,
                answerId: this.state.answerId
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("更新成功")

                }else {
                    message.error(res.msg)
                }

            })
        }
    }

    //确认提交标注后的信息
    addQuestion({packageId, rowNum, wordsNum}){

        let token = getItem("token");
        if (this.state.chooseId == null){
            //判断选择框是否被选择
            message.error("请输入选项!")
        }
            let result = fetchAnswerData({
                choiceId: this.state.chooseId,
                description: this.state.inputMessage,
                packageId: packageId,
                rowNum: rowNum
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("提交成功")
                    this.setState({
                        handleFlag: false,
                        answerId: res.data.id
                    })
                }else {
                    message.error(res.msg)
                }

            })
    }

    //确认提交按钮
    submitChoose({packageId, rowNum, wordsNum}){
        //直接提交
        if (this.props.data.answer == null && this.state.handleFlag){
            this.addQuestion({packageId, rowNum, wordsNum});
        }else {
            this.updateQuestion({wordsNum})
        }
        //更新

    }
    //输入框绑定
    changeInput(e){
        this.setState({
            inputMessage: e.target.value
        })
    }

    //提交文本框信息录入
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //判断是更新还是直接提交
                let flag = this.props.data.answer;
                console.log(values)
                if (flag == null && this.state.handleFlag){
                    this.handleAnswer(values)
                } else{
                    this.updateAnswer(values)
                }
            }
        });
    };

    //提交输入的问题
    handleAnswer(values){
        const token = getItem("token");
        let questionList = this.props.data.choiceOrAnswerDataVOS;
        let rowNum = this.props.rowNum;
        let packageId = this.props.data.dataVOS[0].data.packageId;
        let formList = [];

        questionList.map((value, index) => {
            formList.push({answerHeaderId: value.header.id, content: values[index]})
        });

        //提交答案
        let result = answerDataForm({
            answerDataForms: formList,
            packageId: packageId,
            rowNum: rowNum
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                message.info("提交成功")
                this.setState({
                    handleFlag: false,
                    updateIdList: res.data
                })
                console.log("@@@@@@@@@@@@@")
                console.log(this.state.updateIdList);
            }else {
                message.error(res.msg)
            }

        })
    }


    //更新输入的问题
    updateAnswer(values){
        const token = getItem("token");
        let questionList = this.props.data.choiceOrAnswerDataVOS;
        let rowNum = this.props.rowNum;
        let packageId = this.props.data.dataVOS[0].data.packageId;
        let updateIdList = this.state.updateIdList;
        console.log("啦啦啦啦啦")
        console.log(updateIdList);
        let formList = [];

        if (this.state.handleFlag == true){
            questionList.map((value, index) => {
                formList.push({answerDataId: value.answerData.id, content: values[index]})
            });
        }else {
            updateIdList.map((value, index) => {
                formList.push({answerDataId: value.id, content: values[index]})
            });
        }

        //提交答案
        let result = updateAnswerDataForm({
            answerDataUpdateForms: formList
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                message.info("提交成功")

            }else {
                message.error(res.msg)
            }

        })
    }

    //验证是否超过字数
    validateExceedNumber(rule, value, callback){
        const form = this.props.form;
        const wordsNum = this.props.data.wordsNum;
        if (value == null){
            value = []
        }
        if(wordsNum == -1){
            callback();
        }
        if (value.length > wordsNum) {
            callback(`字数超过最大字数${wordsNum}个`)
        }else {
            callback();
        }
    };
    render(){
        let messageList = [];
        let chooseList = [];

        //0代表没有文本  判断是否是输入框还是选择框
        let hasText = 0;

        //0为为审核，1为正确，2为错误
        let labelStatus = null;


        //限制字数
        let wordsNum = -1;
        try{
            //所有后端数据
            let data = this.props.data.dataVOS;
            hasText = this.props.data.hasText;
            //所有选项列表
            chooseList = this.props.data.choiceOrAnswerDataVOS;
            //输入框字数限制
            wordsNum = this.props.data.wordsNum;
            data.map((value, index) => {
                let object = {};
                let content = value.data.content;
                let name = value.header.name;
                object.name = name;
                object.content = content;
                messageList.push(object)
            });
            console.log("=========================================")
        console.log(chooseList)
        }catch (e) {
            console.log("sss")
        }

        try{
            labelStatus = this.props.data.answer.status;
        }catch (e) {
            console.log("ssss")
        }

        //状态提示
        let statusTip = null

        //设置未审核，错误，正确的状态
        if (labelStatus == 0){
            //未审核
            statusTip = (<div style={{marginLeft:"35px", display:"inline-block", color: "#eb2f96"}}>当前状态:未审核</div>)
        }else if(labelStatus == 1){
            //错误
            statusTip = (<div style={{marginLeft:"35px", display:"inline-block", color: "#52c41a"}}>当前状态:<Icon type="check" theme="outlined" /></div>)
        } else if (labelStatus == 2){
            //正确
            statusTip = (<div style={{marginLeft:"35px", display:"inline-block", color: "#eb2f96"}}>当前状态:<Icon type="close" theme="outlined" /></div>)
        }


        //获取提交选项需要的数据
        let rowNum = null;
        let packageId = null;
        try{
            rowNum = this.props.rowNum;
            packageId = this.props.data.dataVOS[0].data.packageId;
        }catch (e) {
            console.log("Ssss")
        }

        let choiceId = null;
        try {
            choiceId = this.props.data.answer.choiceId
        }catch (e) {
            console.log("sss")
        }

        //角色
        let role = getItem("role");

        const { getFieldDecorator } = this.props.form;
        const { TextArea } = Input;
        return(
            <div id="questionTable">
                <Table
                    columns={columns}
                    dataSource={messageList}
                    bordered
                    pagination={false}
                    columnWidth="100"
                />



                {
                    hasText==0?
                        <div>
                            {/*-------------------------------------------无文本 -----------------------------------------*/}
                            <div style={{marginTop: "10px"}}>请选择您的选项:</div>
                            <RadioGroup defaultValue="" buttonStyle="solid" defaultValue={choiceId} onChange={this.onChange} style={{width: "100%", margin: "20px"}}>
                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    grid={{ gutter: 50, justify:"center" }}
                                    dataSource={chooseList}
                                    renderItem={item => (
                                        <RadioButton style={{marginRight: "10px"}} value={item.id}>{item.content}</RadioButton>
                                    )}
                                />
                            </RadioGroup>
                            <Button type="primary" onClick={()=>{this.submitChoose({packageId, rowNum, wordsNum})}}>提交选项</Button>
                            {
                                statusTip
                            }
                            {
                                role=="2"||role=="3"?
                                    (<div style={{marginTop: "20px"}}><Button type="dashed" style={{marginRight: "10px"}} onClick={()=>{this.handleCorrect()}}>正确</Button><Button type="danger" onClick={()=>{this.handleError()}}>错误</Button></div>):
                                    null
                            }
                        </div>:
                        <div>
                            <Form onSubmit={this.handleSubmit} className="login-form" style={{marginTop: "10px"}}>
                                {
                                    chooseList.map((value, index) =>{
                                        if (value.answerData == null){
                                            value.answerData = {}
                                        }
                                        return (<FormItem
                                                    label={value.header.name}
                                                    labelCol={{ span: 1 }}
                                                    wrapperCol={{ span: 12 }}
                                                >
                                            {getFieldDecorator(String(index),{
                                                rules: [{
                                                    validator: this.validateExceedNumber
                                                }],
                                                initialValue: value.answerData.content
                                            } )(
                                                <TextArea prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                                            )}
                                        </FormItem>)
                                    })

                                }
                                <FormItem labelCol={{ span: 1 }}
                                          wrapperCol={{ span: 12 }}>
                                    <Button type="primary" htmlType="submit" className="login-form-button">确认提交答案</Button>
                                </FormItem>
                            </Form>

                                <statusTip />

                            {
                                statusTip
                            }
                            {
                                role=="2"||role=="3"?
                                    (<div style={{marginTop: "20px"}}><Button type="dashed" style={{marginRight: "10px"}} onClick={()=>{this.handleCorrect()}}>正确</Button><Button type="danger" onClick={()=>{this.handleError()}}>错误</Button></div>):
                                    null
                            }
                        </div>
                }

            </div>
        )
    }
}
export default Form.create()(QuestionTable);
