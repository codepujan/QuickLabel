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


export default class SourceAssistanceCanvas extends React.Component {

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
console.log("Orgi Canvas ",props.orgicanvas);
this.handleMouseDown=this.handleMouseDown.bind(this);
this.handleMouseUp=this.handleMouseUp.bind(this);
this.handleMouseOut=this.handleMouseOut.bind(this);
this.handleMouseMove=this.handleMouseMove.bind(this);
this.handleTouchStart=this.handleTouchStart.bind(this);
this.handleTouchEnd=this.handleTouchEnd.bind(this);
this.handleTouchMove=this.handleTouchMove.bind(this);
this.draw=this.draw.bind(this);
this.updateCanvas=this.updateCanvas.bind(this);
this.prevX = 0;
this.currX = 0;
this.prevY = 0;
this.currY = 0;
this.flag=false;
this.x = "black",
this.y = 2;
this.pencilPoints=[];
this.imageData=props.opState.original.data;
this.imgWidth=props.imgWidth;
this.imgHeight=props.imgHeight;
this.image={};
this.eraserMode=false;
this.eraserWidth=5;
this.eraserHeight=5;
this.pencilColor="green";
this.pencilWidth=3;
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
this.canvasNode={};
this.setchildCanvas=this.setchildCanvas.bind(this);
this.scaleX=props.cWidth/props.imgWidth;
this.scaleY=props.cHeight/props.imgHeight;
this.orgicanvas=props.orgicanvas;
this.state=({imgData:props.opState.original.data,width:props.imgWidth,height:props.imgHeight,zoomMode:false});


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





activateEraserMode(){

console.log("Activating Eraser");
this.eraserMode=true;
}

deactivateEraserMode(){
console.log("Deactivating Eraser");
this.eraserMode=false;

}
externalUpdateCanvas(){
this.updateCanvas(this.state.imgData,this.state.width,this.state.height);
}

componentWillReceiveProps(nextProps) {
console.log("Meanshift Canvas on other side ",nextProps.orgicanvas);
this.orgicanvas=nextProps.orgicanvas;

if(this.currentActive)
return;
else
{
this.deactivateEraserMode();
this.updateCanvas(nextProps.opState.original.data,nextProps.opState.width,nextProps.opState.height);
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

this.prevX = this.currX;
this.prevY = this.currY;
var parentOffset = canvas.getBoundingClientRect();
this.currX = (e.clientX - parentOffset.left);
this.currY = (e.clientY - parentOffset.top);
this.flag=true;
this.orgicanvas.markActive();
this.props.counterAction();

}


handleMouseUp(e){
this.flag=false;
this.props.counterAction();

}


handleMouseOut(e){
this.flag=false;
}



handleMouseMove(e){
//return when we are zooming or panning 

if(this.state.zoomMode==true)
return; 

if (this.flag) {

console.log(this.eraserMode);

const canvas=this.canvasNode;
const ctx=canvas.getContext('2d');
this.prevX = this.currX;
this.prevY = this.currY;
let parentOffset =canvas.getBoundingClientRect();
this.currX = (e.clientX - parentOffset.left);
this.currY = (e.clientY - parentOffset.top);


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
	    this.pencilPoints.push({x:this.currX,y:this.currY});
this.orgicanvas.recievePoints(this.pencilPoints,this);
this.draw(ctx);
}

}//end of eraser Mode or Normal mode Code 

}
}


draw(ctx) {

ctx.clearRect(this.baseX,this.baseY, this.props.cWidth, this.props.cHeight);
ctx.drawImage(this.image,this.baseX,this.baseY,Math.floor(this.imgWidth*this.scaleX*this.contextScale),Math.floor(this.imgHeight*this.scaleY*this.contextScale));
for(var i=0;i<this.pencilPoints.length;i++){
  ctx.beginPath();
// ctx.lineWidth=this.pencilWidth;
ctx.fillStyle = this.pencilColor;
ctx.arc(this.pencilPoints[i].x,this.pencilPoints[i].y,this.pencilWidth, 0, 2 * Math.PI, false);
ctx.fill();
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
style={{marginLeft:10,marginRight:10}}
/>


</div>
</Hammer>
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
