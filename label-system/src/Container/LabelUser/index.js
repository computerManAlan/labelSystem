import React from 'react';
import { Layout, Menu, Icon, Switch, Button } from 'antd';
import './style.less'
import LabelProject from './LabelProject'
import LabelPackage from './LabelPackage'
import {getItem} from "../../util/localStorage";
import { createHashHistory } from 'history'

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;


class LabelUser extends React.Component{
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            current: 'project',
            theme: 'dark',
            currentRender: (<LabelProject />)
        }
    }


    //注销
    logout(){
        localStorage.clear()
        createHashHistory().push('/login')
    }

    handleClick = (e) => {
        switch (e.key){
            case "project":
                this.setState({
                    current: e.key,
                    currentRender: (<LabelProject />)
                });
                break;
            case "package":
                this.setState({
                    current: e.key,
                    currentRender: (<LabelPackage />)
                });
                break;
        }

    };

    render(){
        return (
            <div id="labelUser">
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
                                    <Menu.Item key="project">查看项目</Menu.Item>
                                    <Menu.Item key="package">查看数据包</Menu.Item>
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

export default LabelUser;
