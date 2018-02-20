import React from 'react';

import {render} from 'react-dom';

let labelsetAddURL="https://eskns.com/labelColor/";

import axios from 'axios';
 
import Image from 'react-image-resizer';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import Palx from 'palx';


import { connect } from 'react-redux';
const NAVIGATE_SETTINGS="NAVIGATE_SETTINGS";


const mapStateToProps= state =>({


})


const mapDispatchToProps= dispatch => ({
navigateSettings:()=>dispatch({type:NAVIGATE_SETTINGS}),
gotocolorSettings:()=>dispatch(push(`${path_prefix}/settings`))
})

const path_prefix = '/quicklabel';




function DrawInstanceColors(props){
if(props.instanceViewActive){
return(
<div className="instanceModal"> 
<div id="instanceview">
{props.currentParentColor}
<div className="instanceBox">
 <ul>{props.instancelist}</ul>
</div>
</div>
</div>
);
}else{
return(
<div>

</div>
);

}
}

class ColorSelection extends React.Component{


constructor(props){
super(props);
this.state={
classLabels:[],
instanceViewActive:false,
currentParentColor:''
}
this.createColorsList=this.createColorsList.bind(this);
this.changeCurrentColor=this.changeCurrentColor.bind(this);
this.downloadLabelSettings();
this.createInstanceList=this.createInstanceList.bind(this);

} 


downloadLabelSettings(){
console.log("Downloading Label Settings ");

axios.get(labelsetAddURL,{params:{database:this.props.currentDatabase}}).then((response) =>{
let labelSet=[];
for(var i=0;i<response.data.length;i++){
labelSet.push({label:response.data[i].label,hex:response.data[i].colorhex});
}
this.setState({classLabels:labelSet});
})

}
changeCurrentColor(changeColor){
this.props.colorAction(changeColor);

}



createInstanceList(item){

return(
<div style={{marginRight:4}}>
<div id="pickColor">
<div style={{backgroundColor:item,width:'150px',height:'50px'}} onClick={(event)=>this.changeCurrentColor(item)}></div>
</div>
</div>
);
}


createColorsList(item){
return(
<div style={{marginRight:4}}>
{item.label}
<br/>
<div id="rowArrangement">
<div id="pickColor">
<div style={{backgroundColor:item.hex,width:'150px',height:'50px'}} onClick={(event)=>this.changeCurrentColor(item.hex)}></div>
</div>
<div style={{marginLeft:10}} onClick={(event)=>this.setState({instanceViewActive:true,currentParentColor:item.hex})}>
<Image src={require('../../images/AddColor.png')}
width={20}
height={20}
/>
</div>
</div>
</div>
);
}

render(){
let instances=[];
let mClassLabels=this.state.classLabels;
let listColors=mClassLabels.map(this.createColorsList);
if(this.state.instanceViewActive){
let instanceColors=Palx(this.state.currentParentColor);
instanceColors=instanceColors["gray"]
console.log("Instance Colors ",instanceColors);

instances=instanceColors.map(this.createInstanceList);
}else{
instances=[];
}
if(mClassLabels.length==0){
return(
<div style={{width:600,marginTop:30 ,flexDirection:'row'}}>
<div>No Class Labels Yet.Configure
</div>
<div onClick={(event)=>{
console.log("Going to color Settings ");
this.props.navigateSettings();
this.props.gotocolorSettings();
}}>
<Image src={require('../../images/Settings.png')}
width={40}
height={40}
/>
</div>
</div>
)

}else{

return(
<div id="horizontal">
<div className="colorBox">
 <ul>{listColors}</ul>
</div>
<DrawInstanceColors instanceViewActive={this.state.instanceViewActive} currentParentColor={this.state.currentParentColor} instancelist={instances}/>
</div>
);

}

}



}


export default connect(
mapStateToProps,
mapDispatchToProps)(ColorSelection)
