import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


const addDataSetURL="https://eskns.com/createDataSet/";

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import axios from 'axios';

import { connect } from 'react-redux';

const path_prefix = '/quicklabel';

const mapStateToProps = state => ({
userinfo:state.userinfo
});


import {NAVIGATE_DATA_SET} from '../../reducers/actions_const';

const mapDispatchToProps=dispatch=>({
moveForward:()=>dispatch(push(`${path_prefix}/dataSets`)),
navigate:()=>dispatch({type:NAVIGATE_DATA_SET})

});




class CreateDataSetWizard extends React.Component{
constructor(props){
super(props);

 this.state={
      name:'',
      description:'',
      tags:'',
      classes:'',
      total:0,
      username:'as131123' // TODO : Get this from State variable 
    }

this.handleClick=this.handleClick.bind(this);

}

render() {
    return (
     <div style={{textAlign: 'center'}}>
       <MuiThemeProvider>
        <div>
        <TextField
           hintText="Enter Name of the Dataset"
           floatingLabelText="Dataset Name"
           onChange = {(event,newValue) => this.setState({name:newValue})}
           />
         <br/>
         <TextField
           hintText="Enter the description "
           floatingLabelText=" Description "
           onChange = {(event,newValue) => this.setState({description:newValue})}
           />
         <br/>
        <TextField
           hintText="Tags for the Dataset"
           floatingLabelText="Tags  , Separated By Commas "
           onChange = {(event,newValue) => this.setState({tags:newValue})}
           />
         <br/>
	
	<TextField
           hintText="Classes for the Dataset"
           floatingLabelText="Classes,Separated By Commas "
           onChange = {(event,newValue) => this.setState({classes:newValue})}
           />
         <br/>

<TextField
           hintText="Not Fixed , Expandable"
           floatingLabelText="Estimated Size of Dataset "
           onChange = {(event,newValue) => this.setState({total:newValue})}
           />
         <br/>



           <RaisedButton label="Create !! " primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
       </div>
       </MuiThemeProvider>


        </div>);
  }

   handleClick(event){
 		
	var self=this;

/**
 * TODO: get the state.username from current cache 
 *or sth like that 
**/

console.log(this.state.classes.split(','));
axios.post(addDataSetURL,
{
username:this.state.username,
classes:this.state.classes.split(','),
description:this.state.description,
tags:this.state.tags.split(','),
name:this.state.name,
total:this.state.total,
clientId:this.props.userinfo.clientid.clientId
}).then((response) =>{
console.log("DATASET_ADD",response.data)
this.props.navigate();
this.props.moveForward();

}
)
      .catch((error) => {
      console.log("Error Alert ",error)
          throw(error)
      })


	

        }
}


const style = {
  margin: 15
};

export default connect(
mapStateToProps,
mapDispatchToProps
)(CreateDataSetWizard)
