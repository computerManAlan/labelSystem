import React from 'react'
import { Button, Modal, Form, Input, Icon, Select, message, Menu, Layout } from 'antd';
import {fetchCreateProject, fetchAddProjectUser, fetchsearchProject} from "../../fetch/projectManage";
import {getItem} from "../../util/localStorage";
import AddTitle from './AddTitle'
import AddChoose from './AddChoose'
import AddForm from './AddForm'
import './style.less'
import {fetchAddAllTitle, fetchAddChoices, fetchAddAnswerHeaders} from '../../fetch/projectManage'
import {getRoleListSelectByRandom} from "../../fetch/roleManage";
import AddInputTitle from './AddInputTitile'
import './style.less'

const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;



//需求改变的太多这部分需要重构！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！

class AddRuleButton extends React.Component{
    constructor(props){
        super(props);
        this.getAddUserId = this.getAddUserId.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.getChooses = this.getChooses.bind(this);
        this.onTitleRef = this.onTitleRef.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onChooseRef = this.onChooseRef.bind(this);
        this.getChooseBeforeNum = this.getChooseBeforeNum.bind(this);
        this.getTagBeforeNum = this.getTagBeforeNum.bind(this);
        this.afterClose = this.afterClose.bind(this);
        this.getInputTitle = this.getInputTitle.bind(this);
        this.getInputBeforeNum = this.getInputBeforeNum.bind(this);
        this.onInputRef = this.onTitleRef.bind(this);
        this.state = {
            visible: false,
            current: 'addTitle',
            addUserId: '',
            tag: [],
            id: null,
            chooses: [],
            inputTitle: [],
            beforeTagNum: 0,
            beforeChooseNum: 0,
            beforeInputNum: 0,
            //选择展示的
            isTitle: true,
            isForm: false,
            isChoose: false,
            isInputForm: false
        }
    }

    getTagBeforeNum(num){
        this.setState({
            beforeTagNum: num
        })
    }

    onTitleRef(ref){
        this.child = ref
    }

    onInputRef(ref){
        this.child = ref
    }
    getChooseBeforeNum(num){
        this.setState({
            beforeChooseNum: num
        })
    }

    getInputBeforeNum(num){
        this.setState({
            beforeInputNum: num
        })
    }
    onChooseRef(ref){
        this.child = ref
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    getTitle(value){
        this.setState({
            tag: value
        })
    }

    getChooses(value){
        this.setState({
            chooses: value
        })
    }

    getInputTitle(value){
        this.setState({
            inputTitle: value
        })
    }

    //确认按钮
    handleOk = (e) => {
        let token = getItem("token");
        // 添加人物确定
        if (this.state.current == "addTitle"){
            if (this.state.tag != []){
                let headerForms = [];
                let tags = this.state.tag;
                tags.map((value, index)=>{
                    index = index + this.state.beforeTagNum + 1;
                    let eachHeader = Object.assign({},{columnNum: index, name: value, projectId: this.props.data.id});
                    headerForms.push(eachHeader)
                });

                let result = fetchAddAllTitle({
                    headerForms
                }, token);

                result.then(res=>{
                    return res.json()
                }).then(res=> {
                        if (res.code == 0){
                            message.info("添加表头成功！");
                            this.child.getAllTitle();
                            this.setState({
                                visible: false
                            });
                        } else {
                            if (res.code == 513){
                                message.error("当前表头为做任何修改！")
                            }else{
                                message.error(res.msg)
                            }
                        }
                    }
                )

            }else {
                message.error("请添加标签!")
            }
        }else if (this.state.current == "addRule") {
            //添加选项
            if (this.state.chooses != []){
                let chooseForms = [];
                let tags = this.state.chooses;
                console.log(tags);
                tags.map((value, index)=>{
                    index = index + this.state.beforeChooseNum + 1;
                    let eachChoose = Object.assign({},{content: value, projectId: this.props.data.id});
                    chooseForms.push(eachChoose)
                });


                let result = fetchAddChoices({
                    choiceForms: chooseForms
                }, token);

                result.then(res=>{
                    return res.json()
                }).then(res=> {
                        if (res.code == 0){
                            message.info("添加选项成功！");
                            this.child.getAllChoose();
                            this.setState({
                                visible: false
                            });
                        } else {
                            message.error(res.msg)
                        }
                    }
                )

            }else {
                message.error("请添加选项!")
            }
        } else if (this.state.current == "addInputTitle") {
            //添加选项
            if (this.state.inputTitle != []){
                let chooseForms = [];
                let tags = this.state.inputTitle;
                tags.map((value, index)=>{
                    index = index + this.state.beforeInputNum + 1;
                    let eachChoose = Object.assign({},{columnNum: index, name: value, projectId: this.props.data.id});
                    chooseForms.push(eachChoose)
                });


                let result = fetchAddAnswerHeaders({
                    headerForms: chooseForms
                }, token);

                result.then(res=>{
                    return res.json()
                }).then(res=> {
                        if (res.code == 0){
                            message.info("添加问题成功！");
                            this.child.getAllInputTitle();
                            this.setState({
                                visible: false
                            });
                        } else {
                            message.error(res.msg)
                        }
                    }
                )

            }else {
                message.error("请添加选项!")
            }
        }else if(this.state.current == "addForm"){
            this.setState({
                visible: false
            });
        }
    };

    //取消按钮
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    //页面选择
    handleClick = (e) => {
        switch (e.key){
            case "addTitle":
                this.setState({
                    current: e.key,
                    //选择展示的
                    isTitle: true,
                    isForm: false,
                    isChoose: false,
                    isInputForm: false
                });
                break;
            case "addRule":
                this.setState({
                    current: e.key,
                    //选择展示的
                    isTitle: false,
                    isForm: false,
                    isChoose: true,
                    isInputForm: false

                });
                break;
            case "addInputTitle":
                this.setState({
                    current: e.key,
                    //选择展示的
                    isTitle: false,
                    isForm: false,
                    isChoose: false,
                    isInputForm: true

                });
                break;
            case "addForm":
                this.setState({
                    current: e.key,
                    //选择展示的
                    isTitle: false,
                    isForm: true,
                    isChoose: false,
                    isInputForm: false

                });
                break;

        }
    };

    getAddUserId = (value) =>{
        this.setState({
            addUserId: value
        })
    };

    afterClose = () =>{
        this.setState({
            visible: false
        })
        let page = this.props.page;
        let type = this.props.type;
        this.props.update(page, type)
    };
    render(){
        let id = this.props.data.id;
        //是否有文本
        let hasText = this.props.data.hasText;
        let isChoose = true;
        let isInputForm = true;
        if (hasText == "是"){
            isChoose = false
            isInputForm = true
        }else if(hasText == "否"){
            isChoose = true
            isInputForm = false
        }
        return (
            <div id="addProjectUser">
                <Button type="primary" onClick={this.showModal}>
                    修改
                </Button>
                {
                    this.state.visible?<Modal
                        title="制定规则"
                        visible={true}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        afterClose={this.afterClose}
                        width="40%"
                    >
                        <Menu
                            mode="horizontal"
                            onClick={this.handleClick}
                            selectedKeys={[this.state.current]}
                            mode="horizontal"
                        >
                            <Menu.Item key="addTitle">
                                <Icon type="" />制定表头
                            </Menu.Item>

                            {
                                isChoose?
                                    <Menu.Item key="addRule">
                                    <Icon type="" />添加选择
                                </Menu.Item>:null
                            }
                            {
                                isInputForm?
                                    <Menu.Item key="addInputTitle">
                                    <Icon type="" />添加问题
                                </Menu.Item>:null
                            }
                            <Menu.Item key="addForm">
                                <Icon type="" />上传Excel
                            </Menu.Item>
                        </Menu>
                        <Content>
                            {
                                this.state.isTitle ?
                                    <AddTitle id={id} getTitle={this.getTitle} onRef={this.onTitleRef}
                                              getBeforeNum={this.getTagBeforeNum}/>
                                    : null
                            }{
                                this.state.isChoose?
                                <AddChoose id={id} getChooses={this.getChooses} getBeforeNum={this.getChooseBeforeNum} onRef={this.onChooseRef}/>
                                :null
                            }{
                                this.state.isForm?
                                    (<AddForm id={id}/>)
                                    :null

                            }{
                            this.state.isInputForm?
                                (<AddInputTitle id={id}  getInputTitle={this.getInputTitle} getBeforeNum={this.getInputBeforeNum} onRef={this.onInputRef}/>)
                                :null
                        }
                        </Content>
                    </Modal>:
                        null
                }
            </div>
        )
    }
}
export default AddRuleButton
