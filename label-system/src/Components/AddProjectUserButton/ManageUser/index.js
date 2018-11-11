import React from 'react'
import UserOfProjectTable from '../../UserOfProjectTable'
class ManageUser extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <UserOfProjectTable id={this.props.id}/>
            </div>
        )
    }
}
export default ManageUser;
