import React from 'react';

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


export default class DrawCircleCanvas extends React.Component {
componentDidMount(){
if(this.state.imgData!=undefined)
this.updateCanvas(this.state.imgData,this.state.imgWidth,this.state.imgHeight);

}


constructor(props){
super(props);
this.handleMouseDown=this.handleMouseDown.bind(this);
this.handleMouseUp=this.handleMouseUp.bind(this);
this.handleMouseOut=this.handleMouseOut.bind(this);
this.handleMouseMove=this.handleMouseMove.bind(this);
this.radius=0;
this.nStartX=0;
this.nStartY=0;
this.isDrawing=false;
this.imageData=props.opState.original.data;
this.image={};
this.imgWidth=props.imgWidth;
this.imgHeight=props.imgHeight;

this.scaleX=props.cWidth/props.imgWidth;
this.scaleY=props.cHeight/props.imgHeight;
this.state=({imgData:props.opState.original.data,width:props.cWidth,height:props.cHeight,imgWidth:props.imgWidth,imgHeight:props.imgHeight});
this.orgicanvas=props.orgicanvas;
this.currentActive=false;
this.handleTouchStart=this.handleTouchStart.bind(this);
this.handleTouchEnd=this.handleTouchEnd.bind(this);
this.handleTouchMove=this.handleTouchMove.bind(this);

}

componentWillReceiveProps(nextProps) {
console.log("Circle Next Recieve Props");
console.log(this.currentActive);
this.orgicanvas=nextProps.orgicanvas;

if(this.currentActive)
return;
else{
this.updateCanvas(nextProps.opState.original.data,nextProps.opState.width,nextProps.opState.height);
}
}


updateCanvas(imgData,width,height){

const ctx=this.refs.canvas.getContext('2d');
this.imageData=imgData;
console.log("Updating Canvas");
var image=new Image();
image.src="data:image/png;base64,"+this.imageData;
var root=this;
image.onload=function(){
root.image=image;
console.log("Drawing Image ",image);
ctx.drawImage(image,0,0,Math.floor(width*root.scaleX),Math.floor(height*root.scaleY));

}


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




handleMouseDown(e){

const canvas=this.refs.canvas;
const parentOffset = canvas.getBoundingClientRect();
 this.nStartX = (e.clientX-parentOffset.left)/1;
this.nStartY = (e.clientY-parentOffset.top)/1;
  this.isDrawing = true;
  this.radius = 0;
this.currentActive=true;
this.orgicanvas.recieveMouseDown(this.nStartX,this.nStartY);
this.props.counterAction();

}

handleMouseMove(e){


 if(!this.isDrawing)
    return;
const canvas=this.refs.canvas;
const ctx=canvas.getContext('2d');


var parentOffset = canvas.getBoundingClientRect();


//var nDeltaX = nStartX - ((e.clientX-parentOffset.left)/1);
//  var nDeltaY = nStartY - ((e.clientY-parentOffset.top)/1);
let loc=windowToCanvas(canvas,e.clientX,e.clientY);
let nDeltaX=this.nStartX-loc.x;
let nDeltaY=this.nStartY-loc.y;
 this.radius =Math.sqrt(nDeltaX *nDeltaX + nDeltaY * nDeltaY)




  ctx.clearRect(0, 0,this.props.cWidth,this.props.cHeight);
ctx.drawImage(this.image,0,0,Math.floor(this.imgWidth*this.scaleX),Math.floor(this.imgHeight*this.scaleY));
//console.log(this.nStartX,this.nStartY,this.radius);
ctx.fillStyle = "rgba(0,0,0,0.3)";
ctx.beginPath();
  ctx.arc(this.nStartX, this.nStartY, this.radius, 0, Math.PI*2);
  ctx.fill();

this.orgicanvas.plotCircle(this.nStartX, this.nStartY,this.radius,this);


}

handleMouseUp(e){

 this.isDrawing=false;
this.orgicanvas.recieveMouseUp();
this.props.counterAction();

}

handleMouseOut(e){
this.isDrawing=false;
this.orgicanvas.recieveMouseUp();

}


externalUpdateCanvas(){
console.log("Clearing External Canvas ");
this.updateCanvas(this.state.imgData,this.state.imgWidth,this.state.imgHeight);
}


 render() {
    return (
     <div style={{textAlign: 'center'}}>

          <canvas ref="canvas" width={this.props.cWidth} height={this.props.cHeight} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseOut={this.handleMouseOut}
                onMouseMove={this.handleMouseMove}
onMouseMove={this.handleMouseMove}
onTouchStart={this.handleTouchStart}
onTouchMove={this.handleTouchMove}
onTouchEnd={this.handleTouchEnd}

/>
        </div>);
  }



}


 function windowToCanvas(canvas,x, y) {

    var bbox = canvas.getBoundingClientRect();
    return {
      x: x - bbox.left * (canvas.width / bbox.width),
      y: y - bbox.top * (canvas.height / bbox.height)
    };
  }

