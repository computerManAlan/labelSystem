import React from 'react'
import {Row, Col, Input,Spin, Button, message, Tag, Table, Pagination} from 'antd'
import './style.less'
import {selectByRandom} from '../../../fetch/roleManage'
import {getItem} from "../../../util/localStorage";
import {getLocalTime} from "../../../Static/js";

class AddUser extends React.Component{
    constructor(props){
        super(props);
        this.userSearch = this.userSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.tagClose  = this.tagClose.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.addPeople = this.addPeople.bind(this);
        this.state = {
            inputMessage: '',
            currentPage: 1,
            tableData: {list: [], pageSize:1, total: 1},
            userList: [],
            isLoad: false,
            idList: [],
            list:[]
        }

    }


    //搜索用户
    userSearch(num){
        let token = getItem("token");
        if (num == null){
            num = 1;
        }
        this.setState({
            isLoad: true
        });
        //初始为空
        this.props.addFunc('');

        if (this.state.inputMessage == ''){
            message.error("输入值不能为空")
        }else if(this.state.inputMessage.length > 20){
            message.error("请输入正确的工号")
        } else  {
            let result = selectByRandom({
                pageNum: num,
                info: this.state.inputMessage
            }, token);

            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    this.setState({
                        tableData: res.data,
                        isLoad: false
                    });
                    this.props.addFunc(res.data.id)
                }else {
                    message.error("没有该员工!");
                    message.error(res.msg)
                    this.setState({
                        userList: ''
                    });
                }
            })
        }
    }

    //分页查询
    paginationChange(pageNumber){
        this.setState({
            currentPage: pageNumber
        });
        this.userSearch(pageNumber)
    }


    //输入框双向绑定
    handleChange(event){
        this.setState({
            inputMessage: event.target.value
        })

    }

    //将人添加进列表
    addPeople(id, name){
        let userList = this.state.userList;
        let list = this.state.list;
        let idList = this.state.idList;
        if (userList.indexOf(name) === -1) {
            userList = [...userList, name];
            list.push({id:id, name:name})
            idList.push(id)
        }

        this.setState({
            userList: userList,
            list: list,
            idList: idList
        });
        this.props.addFunc(this.state.idList);
    }

    //将人删除列表
    tagClose = (name)=>{
        const userList = this.state.userList.filter( value => value !== name );
        let idList1 = this.state.idList;
        this.state.list.map((value => {
            if (value.name == name){
                idList1 = idList1.filter(value1 => value1 !== value.id);
            }
        }));
        this.setState({
            userList: userList,
            idList: idList1
        });
        this.props.addFunc(idList1)

    };

    render(){
        const columns = [{
            title: '名字',
            dataIndex: 'name',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '工号',
            dataIndex: 'empNum',
        },{
            title: "角色",
            dataIndex: 'role',
            render: (text, record) => {
                let role = null
                switch (text){
                    case 0:
                        role = "未审核";
                        break;
                    case 1:
                        role = "标注员";
                        break;
                    case 2:
                        role = "质检员";
                        break;
                    case 3:
                        role = "验收员";
                        break;
                    case 4:
                        role = "管理员";
                        break;
                }
                return (
                    <div>{role}</div>
                );
            },
        },{
            title: '添加',
            render: (text, record) => {
                return (
                    <Button type="primary" onClick={()=>{this.addPeople(record.id, record.name)}}>添加</Button>
                );
            },
        }];

        let currentPage = 1;
        //分页信息
        //分页信息
        let pageSize = 0;
        let total = 0;
        try{
            pageSize = this.state.tableData.pageSize;
            total = this.state.tableData.total;
        }catch (e) {
            console.log("ssss")
        }
        return(
            <div id="addUser">
                <Row gutter={6}>
                    <Col span={8}>
                        <Input onChange={this.handleChange} value={this.state.inputMessage}/>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={()=>{ this.userSearch()}}>搜索员工</Button>
                    </Col>
                </Row>
                <Row>
                    <Spin spinning={this.state.isLoad}>
                        <Table
                        columns={columns}
                        dataSource={this.state.tableData.list}
                        bordered
                        style={{marginTop: "10px"}}
                        pagination={false}
                        />
                    </Spin>
                    <div className="pagination-container">
                        <Pagination showQuickJumper defaultCurrent={currentPage} total={total} pageSize={pageSize} current={this.state.currentPage}  onChange={this.paginationChange}/>
                    </div>
                    {
                        this.state.userList.map((value, index)=>{
                            return (<Tag color="#108ee9" key={value} afterClose={()=>{this.tagClose(value)}} closable>{value}</Tag>)
                        })
                    }
                </Row>
            </div>
        )
    }
}

export default AddUser;
