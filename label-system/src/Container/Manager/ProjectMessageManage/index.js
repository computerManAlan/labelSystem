import React from "react";
import { Layout } from 'antd'
import { Menu, Dropdown, Button, Input, Row, Col, Spin, Modal, Form, Icon,Select, Pagination, message } from 'antd';
import AddProjectButton from '../../../Components/AddProjectButton'
import './style.less'
import { getItem } from "../../../util/localStorage";
import ProjectMessageTable from '../../../Components/ProjectMessageTable'
import {getProjectList, fetchsearchProject} from "../../../fetch/projectManage";
import {getRoleListSelectByRandom} from "../../../fetch/roleManage";

const confirm = Modal.confirm;
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
class ProjectMessageManage extends React.Component{
    constructor(props){
        super(props);
        this.keyWordSearch = this.keyWordSearch.bind(this);
        this.searchData = this.searchData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.state = {
            tableData: '',
            tableDataIsLoad: false,
            inputMessage: '',
            currentPage: 1,
            //显示的是否为搜索的页面
            showSearchType: ''
        }
    }

    componentDidMount(){
        this.searchData(1, '')
    }
    //初始化搜索信息
    searchData(numb, type){
        let token = getItem("token");
        if (numb == undefined){
            numb = 1
        }
        this.setState({
            tableDataIsLoad: true
        });
        let result = getProjectList({
            pageNum: numb,
        }, token);

        if (type == ''){
            //普通查询
            result.then(res=>{
                return res.json()
            }).then(res=>{
                res.data.list.map((value, index) => {
                    //将是否有文本转换
                    if (value.hasText == 0){
                        Object.assign(value, {hasText: "否"});
                    }else if (value.hasText == 1){
                        Object.assign(value, {hasText: "是"});

                    }
                    //将状态转换
                    switch (value.status){
                        case 0:
                            Object.assign(value, {status: "未启动"});
                            break;
                        case 1:
                            Object.assign(value, {status: "进行中"});
                            break;
                        case 2:
                            Object.assign(value, {status: "全部完成"});
                            break;
                    }
                });
                this.setState({
                    tableData: res.data,
                    tableDataIsLoad: false,
                });
            });
        }else if (type == 'input') {
            //关键字搜索
            this.keyWordSearch(numb)
        }
    }

    //关键字搜索
    keyWordSearch(page){
        let token = getItem("token");
        if (this.state.inputMessage == '') {
            message.error("输入值不能为空！")
        }else{
            if (page == undefined){
                page = 1
            }
            let result = fetchsearchProject({
                pageNum: page,
                info: this.state.inputMessage
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                res.data.list.map((value, index) => {
                    //将是否有文本转换
                    if (value.hasText == 0){
                        Object.assign(value, {hasText: "否"});
                    }else if (value.hasText == 1){
                        Object.assign(value, {hasText: "是"});

                    }
                    //将状态转换
                    switch (value.status){
                        case 0:
                            Object.assign(value, {status: "未启动"});
                            break;
                        case 1:
                            Object.assign(value, {status: "进行中"});
                            break;
                        case 2:
                            Object.assign(value, {status: "全部完成"});
                            break;
                    }
                });
                this.setState({
                    tableData: res.data,
                    tableDataIsLoad: false,
                    showSearchType: 'input'
                });
            })
        }

    }

    //输入框双向绑定
    handleChange(event){
        this.setState({
            inputMessage: event.target.value
        })
    }
    //分页查询
    paginationChange(pageNumber){
        this.setState({
            currentPage: pageNumber
        });
        this.searchData(pageNumber, this.state.showSearchType)

    }
    render(){
        //分页信息
        let pageSize = 0;
        let total = 0;
        let currentPage = 1;
        try{
            pageSize = this.state.tableData.pageSize;
            total = this.state.tableData.total;
        }catch (e) {
            console.log("ssss")
        }
        return(
            <div id="projectMessageManage">
                <Layout>
                    <Header>
                        <div className="container">
                            <Row>
                                <Col span={8}>
                                    <Input onChange={this.handleChange} placeholder="请按照id或者项目名来搜索项目" value={this.state.inputMessage}/>
                                </Col>
                                <Col span={4}>
                                    <Button type="primary" onClick={()=>{this.keyWordSearch()}}>项目搜索</Button>
                                </Col>
                                <Col span={4}>
                                    <AddProjectButton update={this.searchData} type={this.state.showSearchType} currentPage={this.state.currentPage}/>
                                </Col>
                            </Row>
                        </div>
                    </Header>
                    <Content>
                        <div className="projectMessageTable-container">
                            <ProjectMessageTable  data={this.state.tableData} update={this.searchData} page={this.state.currentPage} type={this.state.showSearchType} isLoad={this.state.tableDataIsLoad}/>
                        </div>
                        <div className="pagination-container">
                            <Pagination showQuickJumper defaultCurrent={currentPage} current={this.state.currentPage} total={total} pageSize={pageSize} onChange={this.paginationChange}/>
                        </div>
                    </Content>
                </Layout>
            </div>
        )
    }
}
export default ProjectMessageManage;
