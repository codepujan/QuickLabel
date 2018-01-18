import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router-dom';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'




import axios from 'axios';

const userLoginURL="https://eskns.com/getUserByName/";

import { connect } from 'react-redux';

import { socketEmit } from 'redux-saga-sc'


import {HashLoader} from 'react-spinners';
import {NAVIGATE_DATA_SET} from '../../reducers/actions_const';

const path_prefix = '/quicklabel';


const SET_CURRENT_USER_ID="SET_CURRENT_USERID";
const mapStateToProps = state => ({
communication:state.communication
});


const mapDispatchToProps=dispatch=>({
moveForward:()=>dispatch(push(`${path_prefix}/dataSets`)),
changeNavigation:()=>dispatch({type:NAVIGATE_DATA_SET}),
setUserDetails:(userid)=>dispatch({type:SET_CURRENT_USER_ID,payload:userid}),
communicate:()=>dispatch(socketEmit({
type:'CONNECTION'

})),
mockOperation:(socketId)=>dispatch(socketEmit({
type:socketId
}))

})


class Login extends React.Component{

constructor(props){
super(props);
console.log("Login Mounted Bro ");

 this.state={
      username:'',
      password:'',
      loggin_spinner:false
    }

this.handleClick=this.handleClick.bind(this);


//this.props.communicate();

}
render() {
if(!(this.state.loggin_spinner)){
    return (
     <div style={{textAlign: 'center'}}>
       <MuiThemeProvider>
        <div id="loginregister">
         <TextField
           hintText="Enter your UserName"
           floatingLabelText="UserName"
           onChange = {(event,newValue) => this.setState({username:newValue})}
           />
         <br/>
           <TextField
             type="password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>

<RaisedButton label="Login" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
       </div>
       </MuiThemeProvider>


        </div>);
}else{
return (<div class='loader'>
        <HashLoader  size={200} color={'#123abc'} loading={true}/>
        </div>);
}

  }


handleClick(event){
        var self=this;

//console.log(this.props.communication.communicationId);

//this.props.mockOperation(this.props.communication.communicationId);


	this.setState({loggin_spinner:true});

	axios.get(userLoginURL,
{
params:{
username:this.state.username,
password:this.state.password
}
}).then((response)=>{


//No need to set State back again 
// Because , we will move Forward to next Screen Anyways
console.log("STATUS",response.data)
this.setState({loggin_spinner:false});
self.props.setUserDetails(this.state.username);
self.props.changeNavigation();
self.props.moveForward();

})
.catch((error) => {
      console.log("Error Alert ",error)
          throw(error)
      })


}


}
const style = {
  margin: 15,
};


export default connect(
mapStateToProps,
mapDispatchToProps
)(Login)
