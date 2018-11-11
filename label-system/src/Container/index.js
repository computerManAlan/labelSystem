import React from 'react'
import { Provider } from 'react-redux';
import configureStore from '../Store/configureStore';
import RouterMap from '../RouterMap/routerMap';
import '../Static/style/common.less'
import '../Static/style/color.less'
import '../Static/style/font.less'

let store = configureStore();
class Web extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Provider store={store}>
                <RouterMap />
            </Provider>
        )
    }
}
export default Web;
