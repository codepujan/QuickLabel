import React from 'react';
import ScaledImage from 'react-image-resizer';
import ColorSwatch from './SketchExample.jsx';
import Hammer from 'react-hammerjs';


const zoomFactor=1.1;

function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}


class MyCanvas extends React.Component{



constructor(props){

super(props);
}




render(){
return(
<canvas ref={(node)=>{
this.props.childTrack(node)
}}
 width={this.props.width} height={this.props.height} onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp} onMouseOut={this.props.onMouseOut}
                onMouseMove={this.props.onMouseMove}
onTouchStart={this.props.onTouchStart}
onTouchMove={this.props.onTouchMove}
onTouchEnd={this.props.onTouchEnd}
/>
);
}

}


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r,g,b){
 var bin = r << 16 | g << 8 | b;
return (function(h){
	return new Array(7-h.length).join("0")+h
	})(bin.toString(16).toUpperCase())


}


export default class DrawFreeFormCanvas extends React.Component {

componentDidMount(){
this.updateCanvas(this.imageData);
if((this.state.imgData!=undefined))
{
this.deactivateEraserMode();
this.updateCanvas(this.state.imgData,this.state.width,this.state.height);
}

}
constructor(props){
super(props);
this.handleMouseDown=this.handleMouseDown.bind(this);
this.handleMouseUp=this.handleMouseUp.bind(this);
this.handleMouseOut=this.handleMouseOut.bind(this);
this.handleMouseMove=this.handleMouseMove.bind(this);
this.handleTouchStart=this.handleTouchStart.bind(this);
this.handleTouchEnd=this.handleTouchEnd.bind(this);
this.handleTouchMove=this.handleTouchMove.bind(this);
this.raw=this.draw.bind(this);
this.updateCanvas=this.updateCanvas.bind(this);
this.prevX = 0;
this.currX = 0;
this.prevY = 0;
this.currY = 0;
this.flag=false;
this.x = "black",
this.y = 2;
this.pencilPoints=[];
this.imageData=props.opState.active.data;
this.imgWidth=props.imgWidth;
this.imgHeight=props.imgHeight;
this.image={};
this.callMyServer=this.callMyServer.bind(this);
this.eraserMode=false;
this.eraserWidth=5;
this.eraserHeight=5;
this.pencilColor="green";
this.pencilWidth=5;
this.currentActive=false;
this.contextScale=1;
this.baseX=0;
this.baseY=0;
this.adjustScale=1;
this.adjustDeltaX=0;
this.adjustDeltaY=0;
this.handlePinch=this.handlePinch.bind(this);
this.handlePan=this.handlePan.bind(this);
this.handlePinchEnd=this.handlePinchEnd.bind(this);
this.handlePanEnd=this.handlePanEnd.bind(this);
this.recievePoints=this.recievePoints.bind(this);
this.canvasNode={};
this.setchildCanvas=this.setchildCanvas.bind(this);
this.scaleX=props.cWidth/props.imgWidth;
this.scaleY=props.cHeight/props.imgHeight;
this.assistanceView={};//View for the assistance ( Original Image ) 

//Added for Straight Line 
this.shiftActive=false;
this.finalPos={};
this.startPos={};
this.shiftPending=false;

this.state=({imgData:props.opState.active.data,width:props.imgWidth,height:props.imgHeight,zoomMode:false});

this.onKeyDown=this.onKeyDown.bind(this);
this.onKeyUp=this.onKeyUp.bind(this);
}


componentWillMount(){
document.addEventListener("keydown",this.onKeyDown);
document.addEventListener("keyup",this.onKeyUp);
}

onKeyDown(e){
if(e.keyCode==16)
{
this.shiftActive=true;
console.log("Shift Active ");
}
}

onKeyUp(e){
if(e.keyCode==16)
{
this.shiftActive=false;
console.log("Shift Not Active ");
}

}

setchildCanvas(child){
this.canvasNode=child;
}

handleTouchStart(e){
console.log("Touch Start , Yayyy");
  let touch = e.touches[0];
this.handleMouseDown(e.touches[0]);
}

handleTouchEnd(e){
console.log("Handle Touch Up");
this.isDown=false;
}


handleTouchMove(e){
console.log("Handle Touch Move ");
 let touch = e.touches[0];
this.handleMouseMove(touch);
}






handlePinch(e){
this.contextScale=this.adjustScale*e.scale;
this.contextScale=(this.contextScale<=1)?1:this.contextScale;
this.baseX=this.adjustDeltaX+(e.deltaX/this.contextScale);
this.baseY=this.adjustDeltaY+(e.deltaY/this.contextScale);
this.updateScaledCanvas();
}

handlePan(e){
this.contextScale=this.adjustScale*e.scale;
this.contextScale=(this.contextScale<=1)?1:this.contextScale;
this.baseX=this.adjustDeltaX+(e.deltaX/this.contextScale);
this.baseY=this.adjustDeltaY+(e.deltaY/this.contextScale);

this.updateScaledCanvas();

}

handlePinchEnd(e){
this.adjustScale=this.contextScale;
this.adjustDeltaX=this.baseX;
this.adjustDeltaY=this.baseY;

}

handlePanEnd(e){
this.adjustScale=this.contextScale;
this.adjustDeltaX=this.baseX;
this.adjustDeltaY=this.baseY;



}


recievePoints(message,orgiref){
const ctx=this.canvasNode.getContext('2d');

this.pencilPoints=message;
this.draw(ctx);
this.assistanceView=orgiref;
}

markActive(){
this.currentActive=true;
}
markInactive(){
this.currentActive=false;

}

callMyServer(){

console.log("Calling Server Broo");

//console.log(this.pencilPoints);

this.currentActive=false;

for(let i=0;i<this.pencilPoints.length;i++){
this.pencilPoints[i].x=Math.floor(((this.pencilPoints[i].x-this.baseX)/this.scaleX)/this.contextScale);
this.pencilPoints[i].y=Math.floor(((this.pencilPoints[i].y-this.baseY)/this.scaleY)/this.contextScale);
}

this.props.opAction('FreeForm',{
points:this.pencilPoints,
rgb:hexToRgb(this.props.currentColor.color),
label:this.props.currentColor.label
},this.props.socketId);

this.pencilPoints=[];
this.assistanceView.pencilPoints=[]; //clearing the other side of the story also 

if(this.assistanceView.externalUpdateCanvas===undefined)
return;

this.assistanceView.externalUpdateCanvas();

}


activateEraserMode(){

console.log("Activating Eraser");
this.eraserMode=true;
}

deactivateEraserMode(){
console.log("Deactivating Eraser");
this.eraserMode=false;

}

componentWillReceiveProps(nextProps) {
if(this.currentActive)
return;
else
{
this.deactivateEraserMode();
this.updateCanvas(nextProps.opState.active.data,nextProps.opState.width,nextProps.opState.height);
}

}

updateScaledCanvas(){

const ctx=this.canvasNode.getContext('2d');

ctx.clearRect(0,0, this.props.cWidth, this.props.cHeight);
ctx.drawImage(this.image,this.baseX,this.baseY,Math.floor(this.imgWidth*this.scaleX*this.contextScale),Math.floor(this.imgHeight*this.scaleY*this.contextScale));

}

updateCanvas(imgData,width,height){

console.log("Ref Check ",this.canvasNode.getContext('2d'));

const ctx=this.canvasNode.getContext('2d');
this.imageData=imgData;

var image=new Image();
image.src="data:image/png;base64,"+this.imageData;
var root=this;
image.onload=function(){
root.image=image;
ctx.clearRect(0,0,root.props.cWidth,root.props.cHeight);
ctx.drawImage(root.image,root.baseX,root.baseY,Math.floor(width*root.scaleX*root.contextScale),Math.floor(height*root.scaleY*root.contextScale));

}
}

handleMouseDown(e){
const canvas=this.canvasNode;
this.currentActive=true;
const ctx=this.canvasNode.getContext('2d');
this.prevX = this.currX;
this.prevY = this.currY;
var parentOffset = canvas.getBoundingClientRect();
this.currX = (e.clientX - parentOffset.left);
this.currY = (e.clientY - parentOffset.top);

if(this.shiftActive){
this.startPos={x:this.currX,y:this.currY};
}else{

if(this.currX!=0 && this.currY!=0){
this.pencilPoints.push({x:this.currX,y:this.currY,drag:false});
this.draw(ctx);

}

}

this.flag=true;
this.props.counterAction();

}


handleMouseUp(e){
if(this.shiftActive){
//Starting Point 
this.pencilPoints.push({x:this.startPos.x,y:this.startPos.y,drag:true});   
//Ending Point
this.pencilPoints.push({x:this.finalPos.x,y:this.finalPos.y,drag:true});
this.shiftActive=false;
this.finalPos={x:0,y:0};
this.startPos={x:0,y:0};
}else{
this.flag=false;
}
this.props.counterAction();
}


handleMouseOut(e){
this.flag=false;
this.props.counterAction();
}



handleMouseMove(e){
//return when we are zooming or panning 

if(this.state.zoomMode==true)
return; 

const canvas=this.canvasNode;
const ctx=canvas.getContext('2d');

let parentOffset=canvas.getBoundingClientRect();
this.currX = (e.clientX - parentOffset.left);
this.currY = (e.clientY - parentOffset.top);

if(this.shiftActive)
{
this.finalPos={x:this.currX,y:this.currY};
this.draw(ctx);
}else{
if (this.flag) {
this.prevX = this.currX;
this.prevY = this.currY;

if(this.eraserMode)
{

for(var i=0;i<this.pencilPoints.length;i++){
if(this.pencilPoints[i].x>=this.currX-this.eraserWidth&&this.pencilPoints[i].x<=this.currX+this.eraserWidth)
if(this.pencilPoints[i].y>=this.currY-this.eraserHeight&&this.pencilPoints[i].y<=this.currY+this.eraserHeight)
{
this.pencilPoints.splice(i,1);
this.draw(ctx);
}
}

}
else{
if(this.currX!=0&&this.currY!=0){
	    this.pencilPoints.push({x:this.currX,y:this.currY,drag:true});
this.draw(ctx);
}

}//end of eraser Mode or Normal mode Code 

}
}
}


draw(ctx) {

//Clear
 	ctx.clearRect(this.baseX,this.baseY, this.props.cWidth, this.props.cHeight);
	ctx.drawImage(this.image,this.baseX,this.baseY,Math.floor(this.imgWidth*this.scaleX*this.contextScale),Math.floor(this.imgHeight*this.scaleY*this.contextScale));

ctx.lineWidth=this.pencilWidth;
ctx.lineJoin="round";
ctx.strokeStyle=this.pencilColor;

 let i = this.pencilPoints.length - 1
    if (!this.pencilPoints[i].drag) {
        if (this.pencilPoints.length == 0) {
            ctx.beginPath();
            ctx.moveTo(this.pencilPoints[i].x, this.pencilPoints[i].y);
            ctx.stroke();
        } else {
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(this.pencilPoints[i].x, this.pencilPoints[i].y);
            ctx.stroke();
        }
    } else {
        ctx.lineTo(this.pencilPoints[i].x, this.pencilPoints[i].y);
        ctx.stroke();
    }

//Draw the entire thingy 

for(let i=0;i<this.pencilPoints.length-2;i++)
{
            ctx.beginPath();
            ctx.moveTo(this.pencilPoints[i].x, this.pencilPoints[i].y);
             ctx.lineTo(this.pencilPoints[i+1].x,this.pencilPoints[i+1].y);
            ctx.stroke();


}


//Draw  the from points and two points 
if(this.shiftActive)
{
console.log("Joining Straight Lines ");
  ctx.beginPath();
        ctx.moveTo(this.startPos.x,this.startPos.y);
        ctx.lineTo(this.finalPos.x,this.finalPos.y);
        ctx.stroke();

}

}

render() {

let root=this;
return (
<div>
<Hammer
onPinch={this.handlePinch}
onPan={this.handlePan}
onPinchEnd={this.handlePinchEnd}
onPanEnd={this.handlePanEnd}
options={{
recognizers: {
  pinch:{enable:root.state.zoomMode},
  pan:{enable:root.state.zoomMode}
}
}}
>
<div style={{textAlign: 'center'}}>
  <MyCanvas width={this.props.cWidth} height={this.props.cHeight} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseOut={this.handleMouseOut}
                onMouseMove={this.handleMouseMove}
onTouchStart={this.handleTouchStart}
onTouchMove={this.handleTouchMove}
onTouchEnd={this.handleTouchEnd}
childTrack={this.setchildCanvas}
/>

</div>
</Hammer>
	<div style={{marginTop:20}}>
	
	<ExtraTools context={this}/>

	</div>
</div>

);
  }


}




function ExtraTools(props){
let mainContext=props.context;
return(
<div className="freeformtoolbox">
<div className="extratool"
onClick={(event)=>{
mainContext.pencilWidth=mainContext.pencilWidth-1;
mainContext.setState({zoomMode:false});

}}
>

<ScaledImage src={require('../../images/Pencil.ico')}
width={20}
height={20}
/>
</div>

<div className="extratool"
onClick={(event)=>{
mainContext.pencilWidth=mainContext.pencilWidth+1;
mainContext.setState({zoomMode:false});

}}
>
<ScaledImage src={require('../../images/Pencil.ico')}
width={40}
height={40}
/>
</div>



<div className="extratool">
<ColorSwatch
changeColorListener={(color)=>{
let colorhex=rgbToHex(color.r,color.g,color.b);
mainContext.pencilColor=colorhex;
}}
/>
</div>


<div className="extratool" 
 onClick={()=>{
mainContext.eraserWidth-=2
mainContext.eraserHeight-=2
}
}
>
<ScaledImage src={require('../../images/Eraser.png')}
width={20}
height={20}
/>
</div>


<div className="extratool"
onClick={()=>{
mainContext.eraserWidth+=2
mainContext.eraserHeight+=2
}
}
>
<ScaledImage src={require('../../images/Eraser.png')}
width={40}
height={40}
/>
</div>


<div className="tool"
onClick={()=>{
mainContext.contextScale*=zoomFactor;
mainContext.updateScaledCanvas(mainContext.state.imgData,mainContext.state.width,mainContext.height);
}}
>
<ScaledImage src={require('../../images/zoom-in.png')}
width={40}
height={40}
/>
</div>


<div className="tool"
onClick={()=>{
mainContext.contextScale/=zoomFactor;
mainContext.updateScaledCanvas(mainContext.state.imgData,mainContext.state.width,mainContext.height);
}}
>
<ScaledImage src={require('../../images/zoom-out.png')}
width={40}
height={40}
/>
</div>


<div className="tool"
onClick={()=>{
mainContext.setState({zoomMode:true});

}}
>
<ScaledImage src={require('../../images/zoompan.png')}
width={40}
height={40}
/>
</div>



</div>
);
}
