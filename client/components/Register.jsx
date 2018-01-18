import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton,RadioButtonGroup} from 'material-ui/RadioButton';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import axios from 'axios';

import {Link} from 'react-router-dom';

import {NAVIGATE_LOGIN} from '../../reducers/actions_const';


import {HashLoader} from 'react-spinners';


const userRegisterURL="https://eskns.com/registerUser/";


const path_prefix = '/quicklabel';

import { connect } from 'react-redux';


const mapStateToProps = state => ({
});


const mapDispatchToProps=dispatch=>({
moveForward:()=>dispatch(push(`${path_prefix}/login`)),
changeNavigation:()=>dispatch({type:NAVIGATE_LOGIN})
})

class Register extends React.Component{

constructor(props){
super(props);

console.log("Register Mounted");

 this.state={
      name:'',
      username:'',
      password:'',
      institute:'',
      email:'',
      type:'',
      loggin_spinner:false
    }



}
//style={{textAlign:'center'}}
render() {
if(!(this.state.loggin_spinner)){
    return (
     <div style={{textAlign:'center'}}>
       <MuiThemeProvider>
        <div id="loginregister">
         <br/>
         <TextField
           hintText="Enter your UserName"
           floatingLabelText="User Name"
           onChange = {(event,newValue) => this.setState({username:newValue})}
           />
         <br/>
        <TextField
           hintText="Enter your Institution"
           floatingLabelText="Institution Name"
           onChange = {(event,newValue) => this.setState({institute:newValue})}
           />
         <br/>
           <TextField
             type="password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
        <br/>
        <TextField
             hintText="Enter your Email"
             floatingLabelText="Email"
             onChange = {(event,newValue) => this.setState({email:newValue})}
             />
           <br/>

<div>
<RadioButtonGroup name="accountType" defaultSelected="student" onChange={(event,value)=>this.setState({type:value})}>

        <RadioButton
        value="student"
        label="Student"
        style={style.radioButton}
        />

        <RadioButton
        value="professor"
        label="Professor"
        style={style.radioButton}
        />


        <RadioButton
        value="group"
        label="Research Group"
        style={style.radioButton}
        />



        </RadioButtonGroup>
<Link to={`${path_prefix}/login`}> Already an User ? Sign in </Link>
</div>


           <RaisedButton label="Register" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
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


        this.setState({loggin_spinner:true});

let self=this;
axios.post(userRegisterURL,
{
username:this.state.username,
password:this.state.password,
email:this.state.email,
institute:this.state.institute,
accountType:this.state.type
}).then((response) =>{
this.setState({loggin_spinner:false});
self.props.changeNavigation();
self.props.moveForward();


}
)
      .catch((error) => {
      console.log("Error Alert ",error)
          throw(error)
      })

	
        }
}


const style = {
  margin: 15,
  radioButton:{
   marginBottom:16
}	
};


export default connect(
mapStateToProps,
mapDispatchToProps
)(Register)

