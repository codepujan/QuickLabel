import React from 'react';

import { connect } from 'react-redux'

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}


export default class DrawRectangleCanvas extends React.Component {

componentDidMount(){
console.log("Rectangle Did Mount ");
if(this.state.imgData!=undefined)
this.updateCanvas(this.state.imgData,this.state.imgWidth,this.state.imgHeight);

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
this.isDown=false;
this.rectStartX=0;
this.rectStartY=0;
this.rectWidth=0;
this.rectHeight=0;
this.startX=0;
this.startY=0;
this.imageData=props.opState.active.data;
this.imgWidth=props.imgWidth;
this.imgHeight=props.imgHeight;
this.image={};
this.callMyServer=this.callMyServer.bind(this);
this.scaleX=props.cWidth/props.imgWidth;
this.scaleY=props.cHeight/props.imgHeight;
this.state=({imgData:props.opState.active.data,width:props.cWidth,height:props.cHeight,imgWidth:props.imgWidth,imgHeight:props.imgHeight});
this.lineWidth=5;
this.lineColor="#ffffff";
this.currentActive=false;
this.recievePoints=this.recievePoints.bind(this);

this.assistanceView={};//View for the assistance ( Original Image ) 


}



callMyServer(){

//payload.tly,message.payload.tlx,message.payload.bry,message.payload.brx
//startY,startX,startY+height,startX+width 

console.log("Calling Server Broo");
console.log("Color Object ",this.props.currentColor);
console.log("Current Color ",this.props.currentColor.color);

console.log("Current Class ",this.props.currentColor.label);

//Temp  : 


this.currentActive=false;
//this.props.currentColor;
//


this.props.opAction('Rectangle',{
tly:Math.floor(this.startY/this.scaleY),
tlx:Math.floor(this.startX/this.scaleX),
bry:Math.floor((this.startY+this.rectHeight)/this.scaleY),
brx:Math.floor((this.startX+this.rectWidth)/this.scaleX),
rgb:hexToRgb(this.props.currentColor.color),
label:this.props.currentColor.label
},this.props.socketId);

this.assistanceView.currentActive=false;
if(this.assistanceView.externalUpdateCanvas===undefined)
return;

this.assistanceView.externalUpdateCanvas();

}

componentWillReceiveProps(nextProps) {
console.log("RECTANGLE NEXT RECIEVE PROPS");
console.log(this.currentActive)
if(this.currentActive)
return; // HOPE THIS WORKS 
else{
this.updateCanvas(nextProps.opState.active.data,nextProps.opState.width,nextProps.opState.height);
}
}


updateCanvas(imgData,width,height){


const ctx=this.refs.canvas.getContext('2d');
this.imageData=imgData;

var image=new Image();
image.src="data:image/png;base64,"+this.imageData;
var root=this;
image.onload=function(){
root.image=image;
console.log("Wiping out Canvas Now ");
ctx.drawImage(image,0,0,Math.floor(width*root.scaleX),Math.floor(height*root.scaleY));
}
}

handleMouseDown(e){


const canvas=this.refs.canvas;
 var parentOffset = canvas.getBoundingClientRect();
    this.startX = parseInt((e.clientX - parentOffset.left)/1.0);
    this.startY = parseInt((e.clientY - parentOffset.top)/1.0);

this.isDown=true;
this.currentActive=true;
this.props.counterAction();

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


handleMouseUp(e){

this.isDown=false;
this.props.counterAction();

}


handleMouseOut(e){

this.isDown=false;

}

recieveMouseDown(startX,startY){

this.startX=startX;
this.startY=startY;
this.isDown=true;
this.currentActive=true;
}

recieveMouseUp(){

this.isDown=false;

}

recievePoints(strokewidth,strokeheight,orgiref){
const ctx=this.refs.canvas.getContext('2d');
 ctx.clearRect(0, 0,this.props.cWidth,this.props.cHeight);
  //calculate the rectangle width/height based
 ctx.drawImage(this.image,0,0,Math.floor(this.imgWidth*this.scaleX),Math.floor(this.imgHeight*this.scaleY));
      ctx.strokeStyle = this.lineColor;
  ctx.lineWidth=this.lineWidth;
      ctx.strokeRect(this.startX,this.startY, strokewidth, strokeheight);
this.rectStartX=this.startX;
this.rectStartY=this.startY;
this.rectWidth=strokewidth;
this.rectHeight=strokeheight;

//Maybe remove this to somewhere else , why SET it every time 
this.assistanceView=orgiref;
}

handleMouseMove(e){

console.log("Mouse Move");
if(!this.isDown)
        return;
const canvas=this.refs.canvas;
const ctx=canvas.getContext('2d');
 var parentOffset = canvas.getBoundingClientRect();

let mouseX;
let mouseY;
    mouseX = parseInt((e.clientX - parentOffset.left)/1.0);
    mouseY = parseInt((e.clientY - parentOffset.top)/1.0);

    // Put your mousemove stuff here

    // clear the canvas
    ctx.clearRect(0, 0,this.props.cWidth,this.props.cHeight);

    // calculate the rectangle width/height based
    // on starting vs current mouse position
    let strokewidth = mouseX - this.startX;
    let strokeheight = mouseY - this.startY;
ctx.drawImage(this.image,0,0,Math.floor(this.imgWidth*this.scaleX),Math.floor(this.imgHeight*this.scaleY));

ctx.strokeStyle = this.lineColor;
ctx.lineWidth=this.lineWidth;

   ctx.strokeRect(this.startX,this.startY, strokewidth, strokeheight);

this.rectStartX=this.startX;
this.rectStartY=this.startY;
this.rectWidth=strokewidth;
this.rectHeight=strokeheight;



}
  render() {
    return (
     <div style={{textAlign: 'center'}}>

          <canvas ref="canvas" width={this.props.cWidth} height={this.props.cHeight} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseOut={this.handleMouseOut}
                onMouseMove={this.handleMouseMove}
onTouchStart={this.handleTouchStart} 
onTouchMove={this.handleTouchMove}
onTouchEnd={this.handleTouchEnd}
/>
        </div>);
  }
}

