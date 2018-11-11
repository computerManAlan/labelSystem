import React from 'react'
import { Pagination } from 'antd'
import LabelProjectTable from '../../../Components/LabelProjectTable'
import {getRoleListSelectByRandom} from "../../../fetch/roleManage";
import {getItem} from "../../../util/localStorage";
import { fetchPackageProject } from '../../../fetch/labelUser'
import './style.less'
import { createHashHistory } from 'history'

class LabelProject extends React.Component{
    constructor(props){
        super(props);
        this.paginationChange = this.paginationChange.bind(this);
        this.searchData = this.searchData.bind(this);
        this.state = {
            currentPage: 1,
            tableData: null,
            tableDataIsLoad: false
        }
    }

    componentDidMount(){
        this.searchData(1)
    }

    searchData(page){
        let token = getItem("token");
        if (page == undefined){
            page = 1
        }
        this.setState({
            tableDataIsLoad: true
        });
        let result = fetchPackageProject({
            pageNum: page
        }, token);

        result.then(res=>{
            return res.json()
        }).then(res=>{
            if (res.code == 0){
                this.setState({
                    tableData: res.data,
                    tableDataIsLoad: false,
                });
            }else if(res.code == 401){
                //清除缓存，跳转至登陆
                localStorage.clear();
                createHashHistory().push('/login')
            }
        })
    }

    //分页查询
    paginationChange(pageNumber){
        this.setState({
            currentPage: pageNumber
        });

        this.searchData(pageNumber)
    }

    render(){
        let currentPage = 1;
        let pageSize = 0;
        let total = 0;
        try{
            pageSize = this.state.tableData.pageSize;
            total = this.state.tableData.total;
        }catch (e) {
            console.log("ssss")
        }
        return (
            <div id="labelProject">
                <div className="labelProjectTable-container">
                    <LabelProjectTable data={this.state.tableData} isLoad={this.state.tableDataIsLoad} update={this.searchData} page={this.state.currentPage} type={this.state.paginationType}/>
                </div>
                <div className="pagination-container">
                    <Pagination showQuickJumper defaultCurrent={currentPage} total={total} pageSize={pageSize} current={this.state.currentPage}  onChange={this.paginationChange}/>
                </div>
            </div>
        )
    }
}

export default LabelProject
