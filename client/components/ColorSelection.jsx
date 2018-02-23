import React from 'react';

import {render} from 'react-dom';

let labelsetAddURL="https://eskns.com/labelColor/";

import axios from 'axios';
 
import Image from 'react-image-resizer';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import Values from 'values.js';

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
<div id="horizontal">

<div style={{marginLeft:6}}>
{"Instances of "+props.currentParentColor}
</div>


<div style={{marginLeft:15}} onClick={(event)=>props.onCloseInstanceMenu()}>
<b>Close</b>
 
<Image src={require('../../images/Close.png')}
width={20}
height={20}
/>
</div>

</div>

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

componentWillReceiveProps(nextProps){

if(nextProps.activeColor!='')
{

//add this color and change state 
console.log("Changing State of this new color ",nextProps.activeColor);

let currentState=this.state.instanceSelected;
currentState[nextProps.activeColor]=true;
this.setState({instanceSelected:currentState},()=>{
});

}else{
//just the instanceList Set , of before 
console.log("Instance List ",nextProps.instanceList);
this.setState({instanceSelected:nextProps.instanceList});


}



}


constructor(props){
super(props);
let prefilled={};

for(let i=0;i<props.instanceList.length;i++)
prefilled[props.instanceList[i]]=true

console.log("Prefiiled ",prefilled);

this.state={
classLabels:[],
instanceViewActive:false,
currentParentColor:'',
currentParent:'',
instanceSelected:prefilled
}
this.createColorsList=this.createColorsList.bind(this);
this.changeCurrentColor=this.changeCurrentColor.bind(this);
this.downloadLabelSettings();
this.createInstanceList=this.createInstanceList.bind(this);
this.closeInstanceMenu=this.closeInstanceMenu.bind(this);
this.curateInstanceList=this.curateInstanceList.bind(this);
this.getTickedIcon=this.getTickedIcon.bind(this);
console.log("Pre Filled Instance List ",props.instanceList);

} 


closeInstanceMenu(){

this.setState({instanceViewActive:false,currentParentColor:'',currentParent:''});

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

//For Test Purposes , let's suppose now that this is itself the list for labeling an instance 
console.log("Changing Color ",changeColor);

//let currentState=this.state.instanceSelected;
//currentState[changeColor]=true;
//this.setState({instanceSelected:currentState},()=>{
this.props.colorAction(changeColor);

//console.log("Instance selected ",this.state.instanceSelected);
//});

}

getTickedIcon(ticked){
if(ticked)
{
return(<div>
<Image src={require('../../images/checkmark.png')}
width={20}
height={20}
/>
</div>);
}
else{
return(<div></div>);
}

}

createInstanceList(item){
return(
<div id="horizontal"style={{}}>
{this.getTickedIcon(item.selected)}
{" # "+item.count}
<div id="pickColor" style={{marginLeft:2}}>
<div style={{backgroundColor:item.hex,width:'150px',height:'50px'}} onClick={(event)=>this.changeCurrentColor(item.hex)}></div>
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
<div style={{marginLeft:10}} onClick={(event)=>this.setState({instanceViewActive:true,currentParentColor:item.hex,currentParent:item.label})}>
<Image src={require('../../images/AddColor.png')}
width={20}
height={20}
/>
</div>
</div>
</div>
);
}


curateInstanceList(instanceColors){

console.log("Curating List ");
let curatedList=[]
console.log("Instance Selected ",this.state.instanceSelected);


console.log("Comparing with ",this.state.instanceSelected);

for(var i=0;i<instanceColors.length;i++){
let hex="#"+instanceColors[i].hex;
curatedList.push({count:i+1,hex:hex,selected:this.state.instanceSelected[hex]==true?true:false});
}
console.log("Curated list ",curatedList);

return curatedList;
}


render(){
let instances=[];
let mClassLabels=this.state.classLabels;
let listColors=mClassLabels.map(this.createColorsList);
if(this.state.instanceViewActive){
//For now ; only getting the gray color : because I am not sure how this thing actually works or even works :( 
let instanceColors=new Values(this.state.currentParentColor).tints(10);
instanceColors=instanceColors;
instanceColors=this.curateInstanceList(instanceColors);
instances=instanceColors.map(this.createInstanceList);
}
else{
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
<DrawInstanceColors instanceViewActive={this.state.instanceViewActive} onCloseInstanceMenu={this.closeInstanceMenu} currentParentColor={this.state.currentParent} instancelist={instances}/>
</div>
);

}

}



}


export default connect(
mapStateToProps,
mapDispatchToProps)(ColorSelection)
