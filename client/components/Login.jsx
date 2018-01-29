import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router-dom';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'


import Snackbar from 'material-ui/Snackbar';


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
      loggin_spinner:false,
	snack_message:'',
	snack_visible:false
    }

this.handleClick=this.handleClick.bind(this);


//this.props.communicate();

}
render() {
if(!(this.state.loggin_spinner)){
    return (
     <div style={{textAlign: 'center'}}>

	<Snackbar
	open={this.state.snack_visible}
	message={this.state.snack_message}
	autoHideDuration={4000}
	onRequestClose={()=>{this.setState({snack_visible:false})}}/>
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

if(response.data.errorCode==-1){
//self.props.setUserDetails(this.state.username);
//self.props.changeNavigation();
//self.props.moveForward();
console.log("Login Succesful ");
}else if(response.data.errorCode==110){

console.log("User with this Crdentials not found ");
this.setState({ snack_message:'User with following credentials not found ',snack_visible:true});
}else if(response.data.errorCode==112){

console.log("Wrong Password");
this.setState({ snack_message:'The Username and Password combination do not match . Please Re- Enter Again ',snack_visible:true});


}

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
