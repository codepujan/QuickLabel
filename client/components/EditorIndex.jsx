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

import CheckCircle from 'material-ui/svg-icons/action/check-circle';

import Save from 'material-ui/svg-icons/action/store';


//REDUX ad REDUX SC Part 
import { connect } from 'react-redux'
import { socketEmit } from 'redux-saga-sc'

const CHANGE_LOADING="LOADING";


let CHANGE_COLOR="COLOR_CHANGE";

const mapStateToProps = state => ({
  operations: state.operations,
  colors:state.colors,
  appState:state.appState,
  imagesets:state.imagesets,
 userinfo:state.userinfo,
 communication:state.communication
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
  changeImage:()=>dispatch({type:"CHANGE"})
})



//Pretty much breajs the encapsulation , So need to find out an akternative 
let currentActiveChild;



function MainScreen(props){
let screenType=props.loading;
let rootContext=props.context;
if(!screenType){
return(
<div>
 <div id="stage">
     <DrawToolbar context={rootContext}/>
        <div>
        <DrawingComponent myState={rootContext.state.currentSelection}  operationState={rootContext.props.operations}  operationAction={rootContext.props.operate}  context={rootContext} spinnerAction={rootContext.props.startLoading} activeColor={rootContext.props.colors} socketId={rootContext.props.communication.communicationId} />
        </div>

        <div style={{height:60}} onClick={(event)=>rootContext.callChildServer()}>

        Current Class :
        <br/>
        <DrawCurrentSelection color={rootContext.state.currentColor}/>
        </div>
       <DrawColorSelection style={{marginLeft:20}} colorAction={rootContext.props.changeColor}/>
        </div>
<div onClick={(event)=>rootContext.props.operate("Completed",{
base64:rootContext.props.operations.image.data,
userid:rootContext.props.userinfo.userid,
datasetid:rootContext.props.imagesets.current,
imageid:rootContext.props.operations.currentImageId
})}>
  <FloatingActionButton style={{position:"absolute",
   bottom:0,
   right:0,marginRight:20,marginBottom:20,justifyContent:'flex-end'}}>
      <CheckCircle />
    </FloatingActionButton>
</div>
<div onClick={(event)=>rootContext.props.operate("Save",{
userid:rootContext.props.userinfo.userid,
datasetid:rootContext.props.imagesets.current,
imageid:rootContext.props.operations.currentImageId
})}>
  <FloatingActionButton style={{position:"absolute",
   bottom:0,
   left:0,marginLeft:20,marginBottom:20,justifyContent:'flex-start'}}>
      <Save />
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
let operationAction=props.operationAction;
let loadSpinnerAction=props.spinnerAction;
let applyColor=props.activeColor;
let socketId=props.socketId;
console.log("Current Selection is ",currentSelection);
let mThis=props.context;

if(currentSelection=='rectangle')
        currentActiveChild=(<div className="theater"> 
 <DrawRectangleCanvas ref={(node)=>{mThis.childComp=node}} opState={operationState} opAction={operationAction} cWidth={500} cHeight={500}  imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height}currentColor={applyColor} socketId={socketId}/></div>);
else if (currentSelection=='circle')
        currentActiveChild=(<div className="theater"> 
<DrawCircleCanvas ref={(node)=>{mThis.childComp=node}} opState={operationState} opAction={operationAction} cWidth={500} cHeight={500} currentColor={applyColor} imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height} socketId={socketId}/></div>);
else if (currentSelection=='freeform')
        currentActiveChild=(<div className="theater"> 
<DrawFreeFormCanvas ref={(node)=>{mThis.childComp=node}} opState={operationState} opAction={operationAction} cWidth={500} cHeight={500} currentColor={applyColor}
imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height} socketId={socketId}
/> </div>);
else if (currentSelection=='magictouch')
	currentActiveChild=(<div className="theater"> 
<MagicTouchToolCanvas ref={(node)=>{mThis.childComp=node}} opState={operationState} opAction={operationAction} cWidth={500} cHeight={500} currentColor={applyColor}
imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height} socketId={socketId}
/> </div>);
else   
 currentActiveChild=(<div className="theater"> 
<NormalCanvas  opState={operationState} opAction={operationAction} cWidth={500} cHeight={500} spinnerStart={loadSpinnerAction}
imgWidth={mThis.props.operations.width} imgHeight={mThis.props.operations.height}
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
<div className="toolbox">

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
	currentImageHeight:288
       }
}
this.childComp=null;
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