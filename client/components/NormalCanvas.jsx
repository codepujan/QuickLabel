import React from 'react';


import { connect } from 'react-redux'



export default class NormalCanvas extends React.Component {
componentDidMount(){
//this.updateCanvas("");

console.log("Normal Canvas Component  Mount");

if(this.state.imgData!=undefined)
this.updateCanvas(this.state.imgData,this.state.imgWidth,this.state.imgHeight);

}

componentWillReceiveProps(nextProps) {
console.log("Normal Component Will Recieve Props ",nextProps);
this.updateCanvas(nextProps.opState.active.data,nextProps.opState.width,nextProps.opState.height);
}

constructor(props){
super(props);
console.log("Normal Constructor called");
this.handleMouseDown=this.handleMouseDown.bind(this);
this.handleMouseUp=this.handleMouseUp.bind(this);
this.handleMouseOut=this.handleMouseOut.bind(this);
this.handleMouseMove=this.handleMouseMove.bind(this);
this.updateCanvas=this.updateCanvas.bind(this);
this.scaleX=props.cWidth/props.imgWidth;
this.scaleY=props.cHeight/props.imgHeight;
this.imageData=props.opState.active.data;
this.state=({imgData:props.opState.active.data,width:props.cWidth,height:props.cHeight,original:props.opState.original,imgWidth:props.imgWidth,imgHeight:props.imgHeight});

}


updateCanvas(imgData,width,height){
this.imageData=imgData;

const ctx=this.refs.canvas.getContext('2d');

var image = new Image();
image.src="data:image/png;base64,"+this.imageData;
let root=this;
image.onload=function(){
root.image=image;
console.log("Drawing Image");
ctx.drawImage(image,0,0,Math.floor(width*root.scaleX),Math.floor(height*root.scaleY));
}


}


handleMouseDown(e){


}

handleMouseUp(e){


}


handleMouseOut(e){


}


handleMouseMove(e){


}
  render() {

console.log("Dataaaa",this.props.opState);
    return (
     <div class="canvasParent" style={{textAlign: 'center'}}>

          <canvas ref="canvas" width={this.props.cWidth} height={this.props.cHeight} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseOut={this.handleMouseOut}
                onMouseMove={this.handleMouseMove}/>


        </div>);
}
}


