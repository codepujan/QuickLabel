import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

//Foreign components 
import FileUploader from './components/FileUploader.jsx';
import TestFileUploader from './components/SmartFileUploader.jsx';
import LoginScreen from './components/Login.jsx';
import RegisterScreen from './components/Register.jsx';

import ShowDataSets from  './components/ShowDataSetList.jsx';

import DrawRectangleCanvas from './components/DrawRectangleCanvas.jsx';

import ShowDataSetImage from './components/ShowDataSetImage.jsx';

import DrawCircleCanvas from './components/DrawCircleCanvas.jsx';

import DrawFreeFormCanvas from './components/DrawFreeFormCanvas.jsx';

import EditorIndex from './components/EditorIndex.jsx';

import ColorDataSet from './components/ColorDataSet.jsx';

import GalleryTest from './components/GalleryTest.jsx';

import CreateDataSetWizard from './components/CreateDataSetWizard.jsx';

import ShowPublicDataSets from './components/ShowPublicDataSets.jsx';


import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';

import { Switch, Route } from 'react-router-dom';

import { connect } from 'react-redux';

const path_prefix = '/quicklabel';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'


import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import {NAVIGATE_DATA_SET,NAVIGATE_PUBLIC_DATA_SET,NAVIGATE_CREATE_DATA_SET,NAVIGATE_SETTINGS}from '../reducers/actions_const';



/**
 *
 * Entirely Temporary 
 */


import TestHammer from './components/HammerTest.jsx';


function ContextualAppBar(props){
let currentScreen=props.activeScreen;
let screenTitle=props.activeScreenTitle;
let context=props.context;


//RIGHT NOW , only imageset has Settings left Icon 
if(currentScreen=='imageset'){

return(
 <AppBar
        title={screenTitle}
        style={{marginBottom:20}} 
iconElementRight={<IconButton>
   <FontIcon className="material-icons">settings</FontIcon> </IconButton>}         
onLeftIconButtonTouchTap={()=>context.handleToggle(currentScreen)}
	onRightIconButtonTouchTap={()=>context.handleMenuItemSelected(3)}

        />
);

}else{

return(
 <AppBar
        title={screenTitle}
	style={{marginBottom:20}}
        onLeftIconButtonTouchTap={()=>context.handleToggle(currentScreen)}
        />
);


}



}

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


class RouteComponent extends React.Component{

render(){
return(
<Switch>
<Route exact path={`${path_prefix}/`} component={RegisterScreen}/>
<Route path={`${path_prefix}/editor`}component={EditorIndex}/>
<Route path={`${path_prefix}/login`}component={LoginScreen}/>
<Route path={`${path_prefix}/register`}component={RegisterScreen}/>
<Route path={`${path_prefix}/createDataSet`} component={CreateDataSetWizard}/>
<Route path={`${path_prefix}/dataSets`} component={ShowDataSets}/>
<Route path={`${path_prefix}/imageSets`} component={ShowDataSetImage}/>
<Route path={`${path_prefix}/imageUploader`} component={FileUploader}/>
<Route path={`${path_prefix}/settings`} component={ColorDataSet}/>
<Route path={`${path_prefix}/publicset`} component={ShowPublicDataSets}/>

</Switch>
);
}

}

export default class AppMain extends React.Component{

 constructor(props) {
    super(props);
    this.state = {open: false,appBarTitle:'Label App'};
 	//TODO: Appbar Title would be determined by state then 

    this.handleToggle=this.handleToggle.bind(this);
    this.handleClose=this.handleClose.bind(this);
    this.handleMenuItemSelected=this.handleMenuItemSelected.bind(this);
  }

handleToggle(currentScreen){

if(currentScreen=="register"||currentScreen=="login")
return;

this.setState({open: !this.state.open})
}
handleClose(){
 this.setState({open: false});
}


handleMenuItemSelected(index){
console.log("Index is ",index);
if(index==0){
this.handleClose();
this.props.store.dispatch({type:NAVIGATE_DATA_SET});
this.props.store.dispatch(push(`${path_prefix}/dataSets`))
}
else if(index==1){
this.handleClose();
this.props.store.dispatch({type:NAVIGATE_PUBLIC_DATA_SET});
this.props.store.dispatch(push(`${path_prefix}/publicset`))
}
else if(index==2){
this.handleClose();
this.props.store.dispatch({type:NAVIGATE_CREATE_DATA_SET});

this.props.store.dispatch(push(`${path_prefix}/createDataSet`))
}
else if(index==3){
this.handleClose();
this.props.store.dispatch({type:NAVIGATE_SETTINGS});

this.props.store.dispatch(push(`${path_prefix}/settings`))
}
else{ 
console.log("Wait, Preparing this menu");
}
}


render(){
console.log("Props",this.props.store.getState().navigationState);

return(
       <MuiThemeProvider>
 <div>
<ContextualAppBar activeScreen={this.props.store.getState().navigationState.stage} context={this} activeScreenTitle={this.props.store.getState().navigationState.title}/>  
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem onClick={()=>this.handleMenuItemSelected(0)}>DataSets</MenuItem>
          <MenuItem onClick={()=>this.handleMenuItemSelected(4)}>Editor</MenuItem>
          <MenuItem onClick={()=>this.handleMenuItemSelected(2)}>Create DataSet</MenuItem>
          <MenuItem onClick={()=>this.handleMenuItemSelected(1)}>Public DataSet </MenuItem>
        </Drawer>
<RouteComponent/>

</div>
       </MuiThemeProvider>
);
}
} 
















