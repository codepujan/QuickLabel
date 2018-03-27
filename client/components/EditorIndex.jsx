import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DrawRectangleCanvas from './DrawRectangleCanvas.jsx';
import DrawCircleCanvas from './DrawCircleCanvas.jsx';
import DrawFreeFormCanvas from './DrawFreeFormCanvas.jsx';
import NormalCanvas from './NormalCanvas.jsx';
import MagicTouchToolCanvas from './MagicTouchToolCanvas.jsx';

import  ColorSelection from './ColorSelection.jsx';

import Image from 'react-image-resizer';
import {HashLoader} from 'react-spinners';

import FloatingActionButton from 'material-ui/FloatingActionButton';

//All the assistance views 

import FreeFormAssistanceCanvas from './FreeFormAssistance.js';
import RectangleAssistanceCanvas from './RectangleAssistance.js';
import CircleAssistance from './CircleAssistance.js';
import PlainAssistView from './PlainAssistView.jsx';

 
import CheckCircle from 'material-ui/svg-icons/action/check-circle';

import Save from 'material-ui/svg-icons/action/store';

import axios from 'axios';

import Reset from 'material-ui/svg-icons/navigation/refresh';


import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'


//REDUX ad REDUX SC Part 
import { connect } from 'react-redux'
import { socketEmit } from 'redux-saga-sc'

const CHANGE_LOADING="LOADING";

const INCREASE_HISTORY_INDEX='INCREASE_HISTORY_INDEX';
const DECREASE_HISTORY_INDEX='DECREASE_HISTORY_INDEX';
const CLEAR_IMAGE_LIST="CLEAR_IMAGE_LIST";

let CHANGE_COLOR="COLOR_CHANGE";

const path_prefix = '/quicklabel';


const addInstanceColorURL="https://eskns.com/addInstancecolor/";

let labelsetAddURL="https://eskns.com/labelColor/";

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



const mapStateToProps = state => ({
  operations: state.operations,
  colors:state.colors,
  appState:state.appState,
  imagesets:state.imagesets,
 userinfo:state.userinfo,
 communication:state.communication,
 history:state.history
})

const mapDispatchToProps = dispatch => ({
  operate: (operationType,datapayload,socketId) => {
console.log("Emitting Socket Id ",socketId);
dispatch(socketEmit({
    type:socketId,
    payload: {operationType,datapayload}
  }))

//I dont know if this works or not
console.log("Operating on class label ",datapayload.label);
 
if(!(datapayload.label===undefined))
dispatch({type:"ADD_ACTIVE_CLASS",payload:datapayload.label});

}
,
  changeColor:(color,label)=>dispatch({type:CHANGE_COLOR,payload:{color:color,label:label}}),
  startLoading:()=>dispatch({type:CHANGE_LOADING}),
  changeImage:()=>dispatch({type:"CHANGE"}),
  goBack:()=>{
	dispatch({type:"NAVIGATE_IMAGE_SET"})
	dispatch(push(`${path_prefix}/imageSets`))
	},
   undoSelection:()=>{
	dispatch({type:DECREASE_HISTORY_INDEX});	
},
    redoSelection:()=>{
	dispatch({type:INCREASE_HISTORY_INDEX});
	},
	clearImages:()=>{
	dispatch({type:CLEAR_IMAGE_LIST});	
	}
})



//Pretty much breajs the encapsulation , So need to find out an akternative 
let currentActiveChild;



function OriginalAssister(props){
let currentSelection=props.myState;
let operationState=props.operationState;
let operationAction=props.operationAction;
let loadSpinnerAction=props.spinnerAction;
let applyColor=props.currentColor;
let socketId=props.socketId;
let mThis=props.context;
let historyState=props.history;
let counterAction=props.counterAdder;

if(props.myState=="freeform")
{
return(<div className="theater"> <FreeFormAssistanceCanvas opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={operationState.width} imgHeight={operationState.height} socketId={socketId} orgicanvas={mThis.state.childref} counterAction={counterAction}
/> </div>);
}else if(props.myState=="rectangle")
{
return(<div className="theater"> <RectangleAssistanceCanvas opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={operationState.width} imgHeight={operationState.height} socketId={socketId} orgicanvas={mThis.state.childref} counterAction={counterAction}
/> </div>);
}else if(props.myState=="circle")
{
return(<div className="theater"> <CircleAssistance opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={operationState.width} imgHeight={operationState.height} socketId={socketId} orgicanvas={mThis.state.childref} counterAction={counterAction}
/> </div>);
}else if(props.myState=="magictouch")
{
return(<div className="theater"> <PlainAssistView opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={operationState.width} imgHeight={operationState.height} socketId={socketId} orgicanvas={mThis.state.childref} history={historyState} counterAction={counterAction}
/> </div>);


}
else{
return (<div></div>);
}

}



function MainScreen(props){
let screenType=props.loading;
let rootContext=props.context;
if(!screenType){
return(
<div>
 <div>
     <DrawToolbar context={rootContext}/>
        </div>
<div id="stage">
        <DrawingComponent myState={rootContext.state.currentSelection}  operationState={rootContext.props.operations}  operationAction={rootContext.props.operate}  context={rootContext} spinnerAction={rootContext.props.startLoading} userinfo={rootContext.props.userinfo} imagesets={rootContext.props.imagesets} activeColor={rootContext.props.colors} socketId={rootContext.props.communication.communicationId} history={rootContext.props.history} undoSelection={rootContext.props.undoSelection} redoSelection={rootContext.props.redoSelection} counterAdder={rootContext.increaseClickCount}/>

<OriginalAssister myState={rootContext.state.currentSelection}  operationState={rootContext.props.operations}  operationAction={rootContext.props.operate}  context={rootContext} spinnerAction={rootContext.props.startLoading} activeColor={rootContext.props.colors} socketId={rootContext.props.communication.communicationId} history={rootContext.props.history} counterAdder={rootContext.increaseClickCount}/>

<div style={{flexDirection:'column'}}>
        <div style={{height:60}} onClick={(event)=>{
console.log("Also Setting Active COlor ",rootContext.state.currentColor.color);

rootContext.setState({activeColor:rootContext.state.currentColor.color},()=>{
rootContext.callChildServer()

});
}
}>

        Current Class :
        <br/>
        <DrawCurrentSelection color={rootContext.state.currentColor.color}/>
        </div>
       <DrawColorSelection style={{marginLeft:20}} colorAction={rootContext.props.changeColor} currentDatabase={rootContext.props.imagesets.current} activeColor={rootContext.state.activeColor} instanceList={rootContext.props.operations.instanceColors}/>
</div>
        </div>
<div onClick={
(event)=>
{
rootContext.props.operate("Completed",{
base64:rootContext.props.operations.active.data,
userid:rootContext.props.userinfo.userid,
datasetid:rootContext.props.imagesets.current,
imageid:rootContext.props.operations.currentImageId
},rootContext.props.communication.communicationId)

rootContext.props. clearImages();
rootContext.props.goBack();

}

}>
  <FloatingActionButton style={{position:"absolute",
   bottom:0,
   right:0,marginRight:20,marginBottom:20,justifyContent:'flex-end'}}>
      <CheckCircle />
    </FloatingActionButton>
</div>
<div onClick={(event)=>
{
rootContext.props.operate("Save",{
userid:rootContext.props.userinfo.userid,
datasetid:rootContext.props.imagesets.current,
imageid:rootContext.props.operations.currentImageId
},rootContext.props.communication.communicationId)

rootContext.props. clearImages();
rootContext.props.goBack();
}
}
>

  <FloatingActionButton style={{position:"absolute",
   bottom:0,
   left:0,marginLeft:20,marginBottom:20,justifyContent:'flex-start'}}>
      <Save />
    </FloatingActionButton>
</div>

<div onClick={(event)=>
{
rootContext.props.operate("Reset",{
userid:rootContext.props.userinfo.userid,
datasetid:rootContext.props.imagesets.current,
imageid:rootContext.props.operations.currentImageId
},rootContext.props.communication.communicationId)
//No need to go back or anything
}
}>
<FloatingActionButton style={{position:"absolute",
   bottom:0,
   left:0,marginLeft:100,marginBottom:20,justifyContent:'flex-start'}}>
      <Reset />
    </FloatingActionButton>



</div>


</div>
);

}else{

return (<div class='loader'>
        <HashLoader  size={200} color={'#123abc'} loading={true}/>
        </div>);


}


}
function DrawingComponent(props){

let currentSelection=props.myState;
let operationState=props.operationState;
let imagesets=props.imagesets;
let userinfo=props.userinfo;
let operationAction=props.operationAction;
let loadSpinnerAction=props.spinnerAction;
let applyColor=props.activeColor;
let socketId=props.socketId;
let historyState=props.history;
let mThis=props.context;
let undoAction=props.undoSelection;
let redoAction=props.redoSelection;
let counterAction=props.counterAdder;


if(currentSelection=='rectangle')
        currentActiveChild=(<div className="theater"> 
 <DrawRectangleCanvas ref={(node)=>{
mThis.childComp=node
if(mThis.state.childrefset!="rectangle")
{
console.log("Setting State of Mounted Chiled Ref ");
mThis.setState({childref:node,childrefset:"rectangle"});
}
else{
console.log("No need to Set State any more ");
}
}}
 opState={operationState} opAction={operationAction} cWidth={450} cHeight={450}  imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height}currentColor={applyColor} socketId={socketId} counterAction={counterAction}/></div>);
else if (currentSelection=='circle')
        currentActiveChild=(<div className="theater"> 
<DrawCircleCanvas ref={(node)=>{
mThis.childComp=node
if(mThis.state.childrefset!="circle")
{
console.log("Setting State of Mounted Chiled Ref ");
mThis.setState({childref:node,childrefset:"circle"});
}
else{
console.log("No need to Set State any more ");
}
}} opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor} imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height} socketId={socketId} counterAction={counterAction}/></div>);
else if (currentSelection=='freeform')
        currentActiveChild=(<div className="theater"> 
<DrawFreeFormCanvas ref={(node)=>{
mThis.childComp=node;
if(mThis.state.childrefset!="freeform") 
{
console.log("Setting State of Mounted Chiled Ref ");
mThis.setState({childref:node,childrefset:"freeform"});
}
else{
console.log("No need to Set State any more ");
}

}}
 opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height} socketId={socketId} counterAction={counterAction}/> </div>);
else if (currentSelection=='magictouch')
	currentActiveChild=(<div className="theater"> 
<MagicTouchToolCanvas ref={(node)=>{
mThis.childComp=node
if(mThis.state.childrefset!="magictouch")
{
console.log("Setting State of Mounted Chiled Ref ");
mThis.setState({childref:node,childrefset:"magictouch"});
}
else{
console.log("No need to Set State any more ");
}

}} opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height} socketId={socketId} history={historyState} undoSelection={undoAction} redoSelection={redoAction} counterAction={counterAction}/> </div>);
else   
 currentActiveChild=(<div className="theater"> 
<NormalCanvas  opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} spinnerStart={loadSpinnerAction}
imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height}
imagesets={imagesets} userinfo={userinfo} counterAction={counterAction}/>
</div>
)

return currentActiveChild;
}



function DrawCurrentSelection(color){
console.log("Color is ",color);
return(
<div id="pickColor" role="button">
<div style={{backgroundColor:color.color,width:'100px',height:'50px'}}></div>
</div>
);


}

function DrawColorSelection(props){


return(
<div>

<ColorSelection colorAction={props.colorAction} currentDatabase={props.currentDatabase} activeColor={props.activeColor} instanceList={props.instanceList}/>

</div>
);
}

function DrawToolbar(props){


return(
<div className="horizontaltoolbox">


<div className="tool" onClick={(event)=>props.context.historyBackward()}>
<Image src={require('../../images/historyback.png')}
width={50}
height={50}
/>
</div>


<div className="tool" onClick={(event)=>props.context.historyForward()}>
<Image src={require('../../images/historyforward.png')}
width={50}
height={50}
/>
</div>

<div className="tool" onClick={(event)=>{
props.context.props.changeImage()
props.context.handleStateChange('normal');
}}>
<Image src={require('../../images/convert.png')}
width={50}
height={50}
/>
</div>

<div className="tool" onClick={(event)=>props.context.handleStateChange('rectangle')}>
<Image src={require('../../images/Rectangle.ico')}
width={50}
height={50}
/>
</div>

<div className="tool" onClick={(event)=>props.context.handleStateChange('circle')}>
<Image src={require('../../images/Circle.png')}
width={50}
height={50}
/>
</div>


<div className="tool" onClick={(event)=>props.context.handleStateChange('freeform')}>
<Image src={require('../../images/Pencil.ico')}
width={50}
height={50}
/>
</div>



<div className="tool" onClick={(event)=>props.context.handleStateChange('magictouch')}>
<Image src={require('../../images/MagicTouch.ico')}
width={50}
height={50}
/>
</div>



<div className="tool" onClick={(event)=>props.context.childComp.activateEraserMode()}>
<Image src={require('../../images/Eraser.png')}
width={50}
height={50}
/>
</div>

<div className="tool" onClick={(event)=>props.context.startTimer()}>
<Image src={require('../../images/start.png')}
width={50}
height={50}
/>
</div>

<div className="tool" onClick={(event)=>props.context.stopTimer()}>
<Image src={require('../../images/stop.png')}
width={50}
height={50}
/>
</div>

<div className="tool" onClick={(event)=>props.context.exportStats()}>
<Image src={require('../../images/exportstat.png')}
width={50}
height={50}
/>
</div>



<div className="tool" onClick={(event)=>props.context.applyForeground()}>
<Image src={require('../../images/foreground.jpg')}
width={50}
height={50}
/>
</div>

<div className="tool" onClick={(event)=>props.context.mergeclasses()}>
<Image src={require('../../images/mergecolors.png')}
width={50}
height={50}
/>
</div>



</div>
);


}
class EditorIndex extends React.Component{

componentWillReceiveProps(nextProps) {
this.setState({currentColor:nextProps.colors});

}



constructor(props){
super(props);

if(this.state===undefined){
 this.state={
        currentSelection:'',
        currentColor:props.colors,
	currentImageWidth:348, //full canvas width and height 
	currentImageHeight:288,
	childref:{},
	childrefset:"set",
	activeColor:''
       }

}
this.childComp={};
this.handleStateChange=this.handleStateChange.bind(this);
this.callChildServer=this.callChildServer.bind(this);
console.log("Before Loading Check",this.props.imagesets.current);
this.addInstanceColor=this.addInstanceColor.bind(this);
this.instancecolors=[];
this.increaseClickCount=this.increaseClickCount.bind(this);
this.startTimer=this.startTimer.bind(this);
this.stopTimer=this.stopTimer.bind(this);

this.exportStats=this.exportStats.bind(this);
this.applyForeground=this.applyForeground.bind(this);
this.historyBackward=this.historyBackward.bind(this);
this.historyForward=this.historyForward.bind(this);
this.mergeclasses=this.mergeclasses.bind(this);

this.clickCount=0;
this.startTime={}
this.duration={}


console.log(this.props.operations.image);

if(Object.keys(this.props.operations.image).length==0){

this.props.operate('Load',{userId:this.props.userinfo.userid,datasetId:this.props.imagesets.current,imageId:this.props.operations.currentImageId},this.props.communication.communicationId);

//PROPS ACTION FOR 
this.props.startLoading();
}
else
{
//Tryna do what mavericks do 
}




}


increaseClickCount(){
this.clickCount=this.clickCount+1;
console.log("Click Count is ",this.clickCount);

}


startTimer(){
console.log("Timer Started ");
this.startTime=new Date();
}

stopTimer(){

let endTime=new Date();
let diff=endTime-this.startTime;

this.duration=diff / 1000;

//console.log("Recorded Duration ",elapsed);

}

exportStats(){
console.log("Duration for the Operation is ",this.duration);
console.log("Clicks taken for the Operation is ",this.clickCount);

}

applyForeground(){

console.log("Apply Foreground ");

console.log("Active Foreground Array is ",this.props.history.activeclasses);
let set=new Set(this.props.history.activeclasses);
let array=Array.from(set);

console.log("Foreground Array is ",array);

this.props.operate("Foreground",{
foregroundArray:array
},this.props.communication.communicationId)
}


mergeclasses(){

console.log("Applying Operation for merging classes ");

axios.get(labelsetAddURL,{params:{database:this.props.imagesets.current}}).then((response) =>{
let labels=[];
let rgbs=[];
for(var i=0;i<response.data.length;i++){
labels.push(response.data[i].label);
rgbs.push(hexToRgb(response.data[i].colorhex));
}

console.log("Merging Labels ",labels);
console.log("Merging Colors",rgbs);

this.props.operate("MergeInstance",{
rgbs:rgbs,
labels:labels
},this.props.communication.communicationId)
})

}


historyBackward(){

this.props.operate("historyback",{},this.props.communication.communicationId)
}

historyForward(){
this.props.operate("historyforward",{},this.props.communication.communicationId)
}

callChildServer(){

if(this.childComp.callMyServer===undefined)
console.log("Cannot Call Child Server without any Child Component active ");
else
{
this.childComp.callMyServer();
this.addInstanceColor(this.state.currentColor.color);

}

}

addInstanceColor(newhex){

for(let i=0;i<this.instancecolors.length;i++){
if(this.instancecolors[i]==newhex)
return;
}
//else new addition , add hex 
//Post Request 
axios.post(addInstanceColorURL,
{
hex:newhex,
userid:this.props.userinfo.userid,
dataset:this.props.imagesets.current,
imageid:this.props.operations.currentImageId
}
).then((response)=>{

console.log("Request Resposne is ",response);

}).catch((error) => {
      console.log("Error Alert ",error)
      console.log(error.body);
          throw(error)
      })

}


handleStateChange(impact){

this.setState({currentSelection:impact});

}

render() {
    return (
        <div>
       <MuiThemeProvider>
 
	<MainScreen loading={this.props.appState} context={this}/>
</MuiThemeProvider>
        </div>



);
}

}

 const style = {
  margin: 15,
};




// move this to grandchildren so the root don't need to subscribe to Redux
 export default connect(
   mapStateToProps,
    mapDispatchToProps
     )(EditorIndex)
