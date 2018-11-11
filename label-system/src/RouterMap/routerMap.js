import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Login from '../Container/Login';
import Register from '../Container/Register';
import Manager from '../Container/Manager'
import GetPassword from '../Container/GetPassword'
import LabelUser from '../Container/LabelUser'
import {getItem} from "../util/localStorage";
import ManageUser from "../Components/AddProjectUserButton/ManageUser";


class RouterMap extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <HashRouter>
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route path='/manager' component={Manager} />
                    <Route path='/login' component={Login} />
                    <Route path='/labelUser' component={LabelUser}/>
                    <Route path='/register' component={Register} />
                    <Route path='/getPassword' component={GetPassword} />
                </Switch>
            </HashRouter>
        )
    }
}

export default RouterMap;
