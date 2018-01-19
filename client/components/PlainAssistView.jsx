import React from 'react';


//REDUX ad REDUX SC Part 
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

function drawSelectedBoundary(boundaries,ctx,scaleX,scaleY){
console.log("Boundaries");

console.log(boundaries);
if(boundaries.length==0)
return;

 for(var i=0;i<boundaries.length;i++){
  for(var j=0;j<boundaries[i].length;j++){
          ctx.beginPath();
      ctx.arc(Math.floor(boundaries[i][j].x*scaleX),Math.floor(boundaries[i][j].y*scaleY),2, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'green';  // Imrpovise here 
      ctx.fill();
     ctx.lineWidth=5;

}
}
}




export default class MagicTouchToolCanvas extends React.Component {
componentDidMount(){
this.updateCanvas(this.imageData);
if(this.state.imgData!=undefined)
this.updateCanvas(this.state.imgData,this.state.imgWidth,this.state.imgHeight,this.state.boundary);

}

componentWillReceiveProps(nextProps) {
this.updateCanvas(nextProps.opState.original.data,nextProps.opState.width,nextProps.opState.height,nextProps.opState.boundary);
}

updateCanvas(imgData,width,height,boundaries){

const ctx=this.refs.canvas.getContext('2d');
this.imageData=imgData;
var image=new Image();
image.src="data:image/png;base64,"+this.imageData;
var root=this;
image.onload=function(){
root.image=image;
ctx.drawImage(root.image,0,0,Math.floor(width*root.scaleX),Math.floor(height*root.scaleY));
drawSelectedBoundary(boundaries,ctx,root.scaleX,root.scaleY);
}
}

constructor(props){
super(props);

this.magicX=0;
this.magicY=0;
this.magicPoints=[];
this.image={};
this.scaleX=props.cWidth/props.imgWidth;
this.scaleY=props.cHeight/props.imgHeight;


this.state=({imgData:props.opState.original.data,width:props.cWidth,height:props.cHeight,boundary:props.opState.boundary,imgWidth:props.imgWidth,imgHeight:props.imgHeight});

}



  render() {

    return (
     <div style={{textAlign: 'center'}}>

          <canvas ref="canvas" width={this.props.cWidth} height={this.props.cHeight}/>
        </div>);
}
}


 function windowToCanvas(canvas,x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
      x: parseInt((x-bbox.left)/1.0),
      y: parseInt((y-bbox.top)/1.0)
    };
  }


