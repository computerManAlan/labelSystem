import React from 'react';
import { Layout, Menu, Icon, Switch, Button } from 'antd';
import './style.less'
import { getRoleList } from "../../fetch/roleManage";
import RoleCheck from "./RoleManage";
import {getItem} from "../../util/localStorage";
import ProjectMessageManage from './ProjectMessageManage'
import PackageMessage from './ProjectPackageMessage';
import {createHashHistory} from "history";
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;


class AdministratorPage extends React.Component{
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this)
        this.state = {
            current: 'roleCheck',
            theme: 'dark',
            currentRender: (<RoleCheck />)
        }
    }


    handleClick = (e) => {
        switch (e.key){
            case "roleCheck":
                this.setState({
                    current: e.key,
                    currentRender: (<RoleCheck />)
                });
                break;
            case "projectMessage":
                this.setState({
                    current: e.key,
                    currentRender: (<ProjectMessageManage />)
                });
                break;
            case "packageMessage":
                this.setState({
                    current: e.key,
                    currentRender: (<PackageMessage />)
                });
                break;
        }

    };
    //注销
    logout(){
        localStorage.clear();
        createHashHistory().push('/login')
    }
    render(){
        return (
            <div id="main">
                <Layout>
                    <Header>
                        <div style={{display: "inline-block"}}>
                            汇众天智
                        </div>
                        <Button shape="circle" icon="logout" style={{float: "right", marginTop: "20px"}} onClick={this.logout} />

                    </Header>
                    <Layout>
                        <div className="side-container">
                            <Sider>
                                <Menu
                                    theme={this.state.theme}
                                    onClick={this.handleClick}
                                    style={{ backgroundColor: '#212830' }}
                                    defaultOpenKeys={['sub1']}
                                    selectedKeys={[this.state.current]}
                                    mode="inline"
                                >
                                    <SubMenu key="sub1" defaultOpenKeys={['roleCheck']} title={<span><Icon type="mail" /><span>用户管理</span></span>}>
                                        <Menu.Item key="roleCheck">人物信息</Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>项目管理</span></span>}>
                                        <Menu.Item key="projectMessage">项目信息</Menu.Item>
                                        <Menu.Item key="packageMessage">数据包信息</Menu.Item>
                                    </SubMenu>

                                </Menu>
                            </Sider>
                        </div>
                        <Content>
                            {this.state.currentRender}
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default AdministratorPage;
