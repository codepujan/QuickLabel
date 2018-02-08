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


import Reset from 'material-ui/svg-icons/navigation/refresh';


import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'


//REDUX ad REDUX SC Part 
import { connect } from 'react-redux'
import { socketEmit } from 'redux-saga-sc'

const CHANGE_LOADING="LOADING";

const INCREASE_HISTORY_INDEX='INCREASE_HISTORY_INDEX';
const DECREASE_HISTORY_INDEX='DECREASE_HISTORY_INDEX';

let CHANGE_COLOR="COLOR_CHANGE";

const path_prefix = '/quicklabel';



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
}
,
  changeColor:(color)=>dispatch({type:CHANGE_COLOR,payload:color}),
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
	}
})



//Pretty much breajs the encapsulation , So need to find out an akternative 
let currentActiveChild;



function OriginalAssister(props){
let currentSelection=props.myState;
let operationState=props.operationState;
let operationAction=props.operationAction;
let loadSpinnerAction=props.spinnerAction;
let applyColor=props.activeColor;
let socketId=props.socketId;
let mThis=props.context;
let historyState=props.history;

if(props.myState=="freeform")
{
return(<div className="theater"> <FreeFormAssistanceCanvas opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={operationState.width} imgHeight={operationState.height} socketId={socketId} orgicanvas={mThis.state.childref}
/> </div>);
}else if(props.myState=="rectangle")
{
return(<div className="theater"> <RectangleAssistanceCanvas opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={operationState.width} imgHeight={operationState.height} socketId={socketId} orgicanvas={mThis.state.childref}
/> </div>);
}else if(props.myState=="circle")
{
return(<div className="theater"> <CircleAssistance opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={operationState.width} imgHeight={operationState.height} socketId={socketId} orgicanvas={mThis.state.childref}
/> </div>);
}else if(props.myState=="magictouch")
{
return(<div className="theater"> <PlainAssistView opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor}
imgWidth={operationState.width} imgHeight={operationState.height} socketId={socketId} orgicanvas={mThis.state.childref} history={historyState}
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
        <DrawingComponent myState={rootContext.state.currentSelection}  operationState={rootContext.props.operations}  operationAction={rootContext.props.operate}  context={rootContext} spinnerAction={rootContext.props.startLoading} userinfo={rootContext.props.userinfo} imagesets={rootContext.props.imagesets} activeColor={rootContext.props.colors} socketId={rootContext.props.communication.communicationId} history={rootContext.props.history} undoSelection={rootContext.props.undoSelection}/>

<OriginalAssister myState={rootContext.state.currentSelection}  operationState={rootContext.props.operations}  operationAction={rootContext.props.operate}  context={rootContext} spinnerAction={rootContext.props.startLoading} activeColor={rootContext.props.colors} socketId={rootContext.props.communication.communicationId} history={rootContext.props.history}/>

<div style={{flexDirection:'column'}}>
        <div style={{height:60}} onClick={(event)=>rootContext.callChildServer()}>

        Current Class :
        <br/>
        <DrawCurrentSelection color={rootContext.state.currentColor}/>
        </div>
       <DrawColorSelection style={{marginLeft:20}} colorAction={rootContext.props.changeColor}/>
</div>
        </div>
<div onClick={
(event)=>
{
rootContext.props.operate("Completed",{
base64:rootContext.props.operations.image.data,
userid:rootContext.props.userinfo.userid,
datasetid:rootContext.props.imagesets.current,
imageid:rootContext.props.operations.currentImageId
},rootContext.props.communication.communicationId)
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
 opState={operationState} opAction={operationAction} cWidth={450} cHeight={450}  imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height}currentColor={applyColor} socketId={socketId}/></div>);
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
}} opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} currentColor={applyColor} imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height} socketId={socketId}/></div>);
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
imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height} socketId={socketId}
/> </div>);
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
imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height} socketId={socketId} history={historyState} undoSelection={undoAction} redoSelection={redoAction}
/> </div>);
else   
 currentActiveChild=(<div className="theater"> 
<NormalCanvas  opState={operationState} opAction={operationAction} cWidth={450} cHeight={450} spinnerStart={loadSpinnerAction}
imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height}
imagesets={imagesets} userinfo={userinfo}
/>
</div>
)

return currentActiveChild;
}



function DrawCurrentSelection(color){
console.log("Color is ",color);
return(
<div id="pickColor" role="button">
<div style={{backgroundColor:color.color,width:'150px',height:'50px'}}></div>
</div>
);


}

function DrawColorSelection(props){


return(
<div className="colorBox">

<ColorSelection colorAction={props.colorAction}/>

</div>
);
}

function DrawToolbar(props){


return(
<div className="horizontaltoolbox">

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
	childrefset:"set"
       }
}
this.childComp={};
this.handleStateChange=this.handleStateChange.bind(this);
this.callChildServer=this.callChildServer.bind(this);
console.log("Before Loading Check",this.props.imagesets.current);
this.callSaveCompletedImage=this.callSaveCompletedImage.bind(this);


console.log("Sending Socket Id ",this.props.communication.communicationId);

this.props.operate('Load',{userId:this.props.userinfo.userid,datasetId:this.props.imagesets.current,imageId:this.props.operations.currentImageId},this.props.communication.communicationId);

//PROPS ACTION FOR 
this.props.startLoading();

}

callChildServer(){

this.childComp.callMyServer();


}

callSaveCompletedImage(){




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
