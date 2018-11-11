import React from 'react'
import {Layout, Col, Row, Input, Button, Pagination, message} from 'antd'
import {fetchsearchProject} from "../../../fetch/projectManage";
import {getItem} from "../../../util/localStorage";
import './style.less'
import {getRoleList, getRoleListSelectByRandom} from "../../../fetch/roleManage";
import PackageMessageTable from '../../../Components/PackageMessageTable'
import {fetchGetAllPackage} from "../../../fetch/packageManage";

const { Header, Footer, Sider, Content } = Layout;

class PackageMessage extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.keyWordSearch = this.keyWordSearch.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.searchData = this.searchData.bind(this);
        this.state = {
            inputMessage: '',
            currentPage: 1,
            tableData: null,
            paginationType: 'all'
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
            let result = fetchGetAllPackage({
                pageNum: page,
            }, token);
            result.then(res=>{
                return res.json()
            }).then(res=>{
                if (res.code == 0){
                    this.setState({
                        tableData: res.data,
                        tableDataIsLoad: false
                    });
                }else {
                    message.error(res.msg)
                }
            })
        }else if (type == "keyWord"){
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
        let result = fetchGetAllPackage({
            pageNum: page,
            info: this.state.inputMessage
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            this.setState({
                tableData: res.data,
                tableDataIsLoad: false,
                paginationType: 'keyWord'
            });
        })
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
        console.log("pageNUM:" + pageNumber)
        let paginationType = this.state.paginationType;
        this.searchData(pageNumber, paginationType)
    }

    render(){
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
            <div id="projectPackageMessage">
                <Layout>
                    <Header>
                        <div className="container">
                            <Row>
                                <Col span={8}>
                                    <Input onChange={this.handleChange} placeholder="请按照项目ID来搜索数据包" value={this.state.inputMessage}/>
                                </Col>
                                <Col span={4}>
                                    <Button type="primary" onClick={()=>{this.keyWordSearch()}}>数据包搜索</Button>
                                </Col>
                            </Row>
                        </div>
                    </Header>
                    <Content>
                        <div className="projectPackageTable-container">
                            <PackageMessageTable data={this.state.tableData} isLoad={this.state.tableDataIsLoad} />
                        </div>
                        <div className="pagination-container">
                            <Pagination showQuickJumper defaultCurrent={currentPage} total={total} pageSize={pageSize} current={this.state.currentPage}  onChange={this.paginationChange}/>
                        </div>
                    </Content>
                </Layout>
            </div>
        )
    }
}
export default PackageMessage;
