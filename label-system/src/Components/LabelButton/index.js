import React from 'react'
import { Modal, Button, message, List, Popconfirm, Radio, Pagination, Card, Spin, Badge } from 'antd';
import './style.less'
import {fetchLabelPackage, fetchLabelOnePackage, fetchBackCheck, fetchBackLabel, fetchSendToCheck, fetchSendToExam,fetchPassExam} from '../../fetch/labelUser'
import {getItem} from "../../util/localStorage";
import QuestionTable from '../QuestionTable'
import './style.less'

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
class LabelButton extends React.Component{
    constructor(props){
        super(props);
        this.getLabelMessage = this.getLabelMessage.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.showQuestion = this.showQuestion.bind(this);
        this.sendBack = this.sendBack.bind(this);
        this.sendCheck = this.sendCheck.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.state = {
            visible: false,
            tableData: null,
            statusList: [],
            statusListIsLoad: true,
            questionTableIsLoad: true,
            packageId: null,
            questionList: [],
            isShowTable: false,
            rowNum: null,
            isRemove: false,
            //button的信息
            submitStatus: null,
            cancelStatus: null
        }
    }

    componentDidMount(){
        let role = getItem('role')
        if (role=="1"){
            this.setState({
                submitStatus: "提交至质检员审核"
            })
        } else if (role=="2"){
            this.setState({
                submitStatus: "提交至验收员审核",
                cancelStatus: "打回标注数据包"
            })
        } else if(role=="3"){
            this.setState({
                submitStatus: "验收通过",
                cancelStatus: "打回审核数据包"
            })
        }
    }

    //刷新页面
    updateTable(){
        this.props.update(this.props.page)
    }
    //审核打回
    sendBack(){
        let role = getItem("role");
        let token = getItem("token");
        let packageId =  this.props.data;
        if (role=="2"){
            //质检员打回
            let result = fetchBackLabel({
                packageId: packageId,
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("打回成功")
                    this.updateTable()
                    this.handleCancel()
                } else {
                    message.error(res.msg)
                }
            })
        }else if (role=="3"){
            //验收员打回
            let result = fetchBackCheck({
                packageId: packageId,
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("打回成功")
                    this.handleCancel()
                    this.updateTable()
                } else {
                    message.error(res.msg)
                }
            })
        }

    }

    //审核通过
    sendCheck(){
        let role = getItem("role")
        let token = getItem("token");
        let packageId = this.props.data;
        if (role=="1"){
            //标注员提交
            //质检员打回
            let result = fetchSendToCheck({
                packageId: packageId,
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("提交成功")
                    this.updateTable()
                    this.handleCancel()
                } else {
                    message.error(res.msg)
                }
            })
        } else if (role=="2"){
            let result = fetchSendToExam({
                packageId: packageId,
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("提交成功")
                    this.updateTable()
                    this.handleCancel()
                } else {
                    message.error(res.msg)
                }
            })
        } else if (role=="3"){
            let result = fetchPassExam({
                packageId: packageId,
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    message.info("提交成功")
                    this.updateTable()
                    this.handleCancel()
                } else {
                    message.error(res.msg)
                }
            })
        }
    }
    getLabelMessage(id, page){
        let token = getItem("token");
        let result = fetchLabelPackage({
            packageId: id,
            pageNum: page
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                let list = res.data.list;

                res.data.list.map((value, index) => {
                    if (value.status == null){
                        value.status = "未标注"
                    } else if (value.status == 0){
                        value.status = "未审核"
                        value.titleColor = "warning"
                    } else if(value.status == 1){
                        value.status = "正确";
                        value.titleColor = "success"
                    } else if (value.status == 2){
                        value.status = "错误"
                        value.titleColor = "error"
                    }
                })
                this.setState({
                    tableData: res.data,
                    statusList: res.data.list,
                    statusListIsLoad: false
                })
                console.log(res.data)
            } else {
                message.error(res.msg)
            }
        })
    }

    //展示问题
    showQuestion(row){
        let token = getItem("token");
        //卸载数据表
        this.setState({
            isShowTable: false
        })
        let id = this.props.data;
        let result = fetchLabelOnePackage({
            packageId: id,
            rowNum: row
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                console.log(res.data);
                this.setState({
                    questionList: res.data,
                    questionTableIsLoad: false,
                    isShowTable: true,
                    rowNum: row
                })
            }else {
                message.error(res.msg)
            }
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });

        this.setState({
            packageID: this.props.data,
            isRemove: false
        });
        let packageId = this.props.data;
        this.getLabelMessage(packageId,1)
    };


    //点击确定
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
        let packageId = this.props.data;
        this.getLabelMessage(packageId,1)
    };

    //点击取消
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            tableData: null,
            statusList: [],
            statusListIsLoad: true,
            questionTableIsLoad: true,
            packageId: null,
            questionList: [],
            isShowTable: false,
            rowNum: null,
            isRemove: true
        });
    };

    //分页查询
    paginationChange(pageNumber){
        this.setState({
            currentPage: pageNumber
        });
        this.getLabelMessage(this.props.data,pageNumber)
    }

    render(){
        function onChange(e) {
            console.log('radio checked:' + e.target.value);
        }

        let currentPage = 1;
        let pageSize = 0;
        let total = 0;
        try{
            pageSize = this.state.tableData.pageSize;
            total = this.state.tableData.total;
        }catch (e) {
            console.log("ssss")
        }

        let defaultValue = '';
        try {
            defaultValue = this.state.statusList[0].rowNum;
        }catch (e) {
            console.log("")
        }
        let role = getItem("role");
        let titleColor = null;

        let title = null
        switch (role){
            case "1":
                title = "标注";
                break;
            case "2":
                title = "质检";
                break;
            case "3":
                title = "验收";
                break
        }


        return(
            <div id="labelButton">

                <Button type="primary" onClick={this.showModal} disabled={this.props.isDisabled}>
                    {this.props.buttonName}
                </Button>

                {/*卸载组件*/}
                {
                    this.state.isRemove? '':
                        <Modal
                            title={title}
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            afterClose={this.handleCancel}
                            width="90%"
                            maskClosable={false}
                            onCancel={this.handleCancel}
                            footer={

                                role=="1"? <Button key="submit" type="primary"  onClick={this.sendCheck}>
                                    {this.state.submitStatus}
                                    </Button>:

                                [
                                <Button key="back" onClick={this.sendBack}>{this.state.cancelStatus}</Button>,
                                <Button key="submit" type="primary"  onClick={this.sendCheck}>
                                    {this.state.submitStatus}
                                </Button>
                            ]}
                        >
                            <div style={{marginBottom: "20px"}}>请选择您要标注的信息：</div>
                            <Spin tip="Loading..." spinning={this.state.statusListIsLoad}>
                                <RadioGroup defaultValue='' buttonStyle="solid" style={{width: "100%"}}>
                                    <List
                                        itemLayout="vertical"
                                        size="large"
                                        grid={{ gutter: 50, justify:"center" }}
                                        dataSource={this.state.statusList}
                                        renderItem={item => (
                                            <List.Item style={{float: "left"}}>
                                                <Card
                                                    title={<Badge status={item.titleColor}>{item.status}</Badge>}
                                                    style={{ width: 100 }}
                                                >
                                                    <div></div>
                                                    <RadioButton value={item.rowNum} onClick={()=>{this.showQuestion(item.rowNum)}}>{item.rowNum}</RadioButton>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                    <div className="pagination-container">
                                        <Pagination  style={{float: "right"}} showQuickJumper defaultCurrent={currentPage} total={total} pageSize={pageSize} current={this.state.currentPage}  onChange={this.paginationChange}/>
                                    </div>
                                </RadioGroup>
                            </Spin>
                            {
                                this.state.isShowTable?
                                    <Spin spinning={this.state.questionTableIsLoad}>
                                        <QuestionTable data={this.state.questionList} rowNum={this.state.rowNum}/>
                                    </Spin>:
                                    ''
                            }
                        </Modal>

                }

            </div>
        )
    }
}

export default LabelButton;
