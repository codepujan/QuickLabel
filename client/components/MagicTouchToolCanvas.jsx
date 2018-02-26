import React from 'react';
import ScaledImage from 'react-image-resizer';


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



function drawSelectedBoundary(boundaries,ctx,scaleX,scaleY,historyActive){


console.log("History Active Index is ",historyActive);
console.log("Boundaries Length is ",boundaries.length);

if(boundaries.length==0)
return;

 for(var i=0;i<historyActive;i++){
  for(var j=0;j<boundaries[i].length;j++){
          ctx.beginPath();
      ctx.arc(Math.floor(boundaries[i][j].x*scaleX),Math.floor(boundaries[i][j].y*scaleY),2, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'white';  // Imrpovise here 
      ctx.fill();
     ctx.lineWidth=5;

}
}
}


export default class MagicTouchToolCanvas extends React.Component {
componentDidMount(){
this.updateCanvas(this.imageData);
if(this.state.imgData!=undefined)
this.updateCanvas(this.state.imgData,this.state.imgWidth,this.state.imgHeight,this.state.boundary,this.activeHistory);

}

componentWillReceiveProps(nextProps) {

console.log("Next Props",nextProps);
this.activeHistory=nextProps.opState.activeboundaryIndex;
console.log("Active History index is ",this.activeHistory);
this.boundaries=nextProps.opState.boundary;
this.activeboundaryIndex=nextProps.opState.activeboundaryIndex;

this.updateCanvas(nextProps.opState.active.data,nextProps.opState.width,nextProps.opState.height,nextProps.opState.boundary,nextProps.opState.activeboundaryIndex);

}

updateCanvas(imgData,width,height,boundaries,activeHistory){

console.log("History Index inside Canvas ",activeHistory);

const ctx=this.refs.canvas.getContext('2d');
this.imageData=imgData;
var image=new Image();
image.src="data:image/png;base64,"+this.imageData;
var root=this;
image.onload=function(){
root.image=image;
ctx.drawImage(root.image,0,0,Math.floor(width*root.scaleX),Math.floor(height*root.scaleY));
drawSelectedBoundary(boundaries,ctx,root.scaleX,root.scaleY,activeHistory);
}
}

constructor(props){
super(props);

this.handleMouseDown=this.handleMouseDown.bind(this);
this.handleTouchStart=this.handleTouchStart.bind(this);
this.askForBoundary=this.askForBoundary.bind(this);
this.magicX=0;
this.magicY=0;
this.magicPoints=[];
this.image={};
this.scaleX=props.cWidth/props.imgWidth;
this.scaleY=props.cHeight/props.imgHeight;
this.activeHistory=this.props.opState.activeboundaryIndex;
this.activePointCount=0;
this.state=({imgData:props.opState.active.data,width:props.cWidth,height:props.cHeight,boundary:props.opState.boundary,imgWidth:props.imgWidth,imgHeight:props.imgHeight});

this.undoSelection=this.undoSelection.bind(this);
this.redoSelection=this.redoSelection.bind(this);
this.activeboundaryIndex=0;
this.boundaries=[];
}


handleTouchStart(e){
console.log("Touch Start , Yayyy");
  let touch = e.touches[0];
this.handleMouseDown(e.touches[0]);
}

handleMouseDown(e){

const canvas=this.refs.canvas;

   this.magicX=  Math.floor(windowToCanvas(canvas,e.clientX,e.clientY).x);
   this.magicY=  Math.floor(windowToCanvas(canvas,e.clientX,e.clientY).y);

console.log("Adding");
console.log("TouchX",this.magicX);
console.log("TouchY",this.magicY);
this.askForBoundary(this.magicY,this.magicX);
this.activePointCount=this.activePointCount+1;
this.magicPoints.push({x:Math.floor(this.magicX/this.scaleX),y:Math.floor(this.magicY/this.scaleY)});

this.props.counterAction();

}


callMyServer(){


//TODO : Not only magic points : only selected magic points 
this.props.opAction('MagicTouch',{
points:this.magicPoints,
rgb:hexToRgb(this.props.currentColor)
},this.props.socketId);
}

askForBoundary(myy,myx){
console.log("ASking for Boundary ",myy," - ",myx);

this.props.opAction('Boundary',{
y:Math.floor(myy/this.scaleY),
x:Math.floor(myx/this.scaleX)
},this.props.socketId);
}

undoSelection(){
console.log("Undoing Selection ");

this.props.undoSelection();
console.log("Erasing Magic Touch of Index",this.activePointCount);

this.activePointCount=this.activePointCount-1;
this.magicPoints.splice(this.activePointCount,1);

}


redoSelection(){
console.log("Interested index is ",this.activeboundaryIndex+1);

console.log("Boundaries Available is ",this.boundaries);

let testPoint=this.boundaries[this.activeboundaryIndex];
console.log("Test Point is ",testPoint[10]);
this.magicPoints.push({x:testPoint[10].x,y:testPoint[10].y});

this.props.redoSelection();

}

  render() {

    return (
	<div>
     <div style={{textAlign: 'center'}}>

          <canvas ref="canvas" width={this.props.cWidth} height={this.props.cHeight} onMouseDown={this.handleMouseDown}
onTouchStart={this.handleTouchStart}/>
</div>

<div style={{marginTop:20}}>

        <ExtraTools context={this}/>
        </div>
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

function ExtraTools(props){
let mainContext=props.context;
return(
<div className="freeformtoolbox">
<div className="extratool"
onClick={(event)=>{
mainContext.undoSelection();
}}
>

<ScaledImage src={require('../../images/Undo.png')}
width={40}
height={40}
/>
</div>


<div className="extratool"
onClick={(event)=>{
mainContext.redoSelection()
}}
>
<ScaledImage src={require('../../images/Redo.png')}
width={40}
height={40}
/>
</div>



</div>
);
}
