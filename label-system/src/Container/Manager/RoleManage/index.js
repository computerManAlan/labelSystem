import React from 'react'
import { Layout } from 'antd'
import { Menu, Dropdown, Button, Input, Row, Col, Spin, Modal, Form, Icon,Select, Pagination } from 'antd';
import RoleCheckTable from '../../../Components/RoleCheckTable'
import AddUserButton from '../../../Components/AddUserButton'
import './style.less'
import {
    getRoleList,
    getRoleListSelectByRandom,
    getRoleListSelectByRole,
    updateTheUser
} from "../../../fetch/roleManage";
import { getItem } from "../../../util/localStorage";
import {message} from "antd/lib/index";
import {createHashHistory} from "history";


const confirm = Modal.confirm;
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class RoleCheckInit extends React.Component{
    constructor(props){
        super(props);
        this.searchData = this.searchData.bind(this);
        this.searchTypeClick = this.searchTypeClick.bind(this);
        this.searchConditionData = this.searchConditionData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.roleSelect = this.roleSelect.bind(this);
        this.keyWordSearch = this.keyWordSearch.bind(this);
        this.roleSearch = this.roleSearch.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.addUser = this.addUser.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.state = {
            dropDownType: '关键字搜索',
            searchType: "input",
            currentRole: "未审核用户",
            //初始化显示信息
            tableData: '',
            tableDataIsLoad: true,
            inputMessage: '',
            paginationType: 'all',
            addRoleChoose: "标注员",
            visible: false,
            currentPage: 1
        }
    }

    componentDidMount(){
        // 得到人物审核数据
        this.searchData(1, "all")
    }

    //初始化搜索信息
    searchData(page, type){
        let token = getItem("token");
        this.setState({
            tableDataIsLoad: true
        });

        if (type == "all"){
            let result = getRoleList({
                pageNum: page,
            }, token);
            result.then(res=>{
                return res.json()
            }).then(res=>{
                //token过期
                if (res.code == 0){
                    this.setState({
                        tableData: res.data,
                        tableDataIsLoad: false
                    });
                }else if (res.code == 401) {
                    //清除缓存
                    localStorage.clear();
                    createHashHistory().push('/labelUser')
                }
            })
        }else if (type == "role"){
            this.roleSearch(page)
        } else if (type == "keyWord"){
            this.keyWordSearch(page)
        }

    }


    //关键字搜索
    keyWordSearch(page){
        let token = getItem("token");
        if (page == undefined){
            page = 1
        }
        this.setState({
            tableDataIsLoad: true
        });
        let result = getRoleListSelectByRandom({
            pageNum: page,
            info: this.state.inputMessage
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                this.setState({
                    tableData: res.data,
                    tableDataIsLoad: false,
                    paginationType: 'keyWord'
                });
            } else {
                message.error(res.code)
            }
        })
    }

    //条件搜索
    roleSearch(page){
        let token = getItem("token");
        if (page == undefined){
            page = 1
        }
        this.setState({
            tableDataIsLoad: true
        });
        let role = null;
        switch (this.state.currentRole){
            case "未审核用户":
                role = 0;
                break;
            case "标注员":
                role = 1;
                break;
            case "质检员":
                role = 2;
                break;
            case "验收员":
                role = 3;
                break
        }


        let result = getRoleListSelectByRole({
            pageNum: page,
            role: role
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                this.setState({
                    tableData: res.data,
                    tableDataIsLoad: false,
                    paginationType: 'role'
                });
            }else {
                message.error(res.msg)
            }
        })
    }

    //按条件搜索
    searchConditionData(){
        //关键字搜索
        if (this.state.dropDownType == "关键字搜索"){

            if (this.state.inputMessage == ''){
                message.error("输入值不能为空");
            } else {
                this.keyWordSearch()
            }
        //角色查找
        }else if (this.state.dropDownType == "角色搜索"){
            this.roleSearch()
        }
    }

    //角色搜索的角色选择
    roleTypeClick = (e) => {
        this.setState({
            currentRole: e.key
        });
    };

    searchTypeClick = (e) => {
        switch (e.key){
            case "keyword":
                this.setState({
                    dropDownType: '关键字搜索',
                    searchType: 'input'
                });
                break;
            case "role":
                //替换为选择框
                this.setState({
                    dropDownType: '角色搜索',
                    searchType: 'dropDown'
                });
                break;

        }
    };

    //输入框双向绑定
    handleChange(event){
        this.setState({
            inputMessage: event.target.value
        })
    }


    //添加人物权限权限选择
    roleSelect(value) {
        this.setState({
            addRoleChoose: value
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
    //添加用户
    showModal(){
        this.setState({
            visible: true,
        });
    };

    addUser(){
        this.setState({
            visible: false,
        });
    }

    handleCancel(e){
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    //分页查询
    paginationChange(pageNumber){
        this.setState({
            currentPage: pageNumber
        });
        console.log("pageNUM:" + pageNumber)
        let paginationType = this.state.paginationType;
        this.searchData(pageNumber, paginationType)
    }

    render(){
        //搜索类型菜单
        const searchMenu = (
            <Menu onClick={this.searchTypeClick}>
                <Menu.Item key="keyword">
                    <span>关键字搜索</span>
                </Menu.Item>
                <Menu.Item key="role">
                    <span>角色搜索</span>
                </Menu.Item>
            </Menu>
        );

        //搜索角色类型菜单
        let roleMenu = (
            <Menu onClick={this.roleTypeClick}>
                <Menu.Item key="未审核用户">
                    <span>未审核用户</span>
                </Menu.Item>
                <Menu.Item key="标注员">
                    <span>标注员</span>
                </Menu.Item>
                <Menu.Item key="质检员">
                    <span>质检员</span>
                </Menu.Item>
                <Menu.Item key="验收员">
                    <span>验收员</span>
                </Menu.Item>
            </Menu>
        );

        //搜索框
        let searchDropDown = (
            <Dropdown overlay={roleMenu} placement="bottomCenter">
                <Button type="large">{this.state.currentRole}</Button>
            </Dropdown>
        );

        //输入框
        const searchInput = (<Input placeholder="请按照姓名，电话，qq或者工号来搜索用户" onChange={this.handleChange} value={this.state.inputMessage}/>);
        const { getFieldDecorator } = this.props.form;

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
            <div id="roleCheck">
                <Layout>
                    <Header>
                        <div className="container">
                            <Row>
                                <Col span={4}>
                                    <Dropdown overlay={searchMenu} placement="bottomCenter">
                                        <Button type="primary">{this.state.dropDownType}</Button>
                                    </Dropdown>
                                </Col>
                                <Col span={8}>
                                    {
                                        this.state.searchType=="input"? searchInput: searchDropDown
                                    }
                                </Col>
                                <Col span={4}>
                                    <Button type="primary" onClick={this.searchConditionData}>搜索</Button>
                                </Col>
                                <Col span={4}>
                                    <AddUserButton update={this.searchData}/>
                                </Col>
                            </Row>
                        </div>
                    </Header>
                    <Content>
                        <div className="roleCheckTable-container">
                            <RoleCheckTable data={this.state.tableData} isLoad={this.state.tableDataIsLoad} update={this.searchData} page={this.state.currentPage} type={this.state.paginationType}/>
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

const RoleCheck = Form.create()(RoleCheckInit);
export default RoleCheck
