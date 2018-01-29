import React from 'react';


import { connect } from 'react-redux'

import TextField from 'material-ui/TextField';
import Save from 'material-ui/svg-icons/action/bookmark';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import axios from 'axios';

let updatenoteURL="https://eskns.com/addimagenote/";

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
console.log("Notes",this.props.opState.notes);

this.handleMouseDown=this.handleMouseDown.bind(this);
this.handleMouseUp=this.handleMouseUp.bind(this);
this.handleMouseOut=this.handleMouseOut.bind(this);
this.handleMouseMove=this.handleMouseMove.bind(this);
this.updateCanvas=this.updateCanvas.bind(this);
this.scaleX=props.cWidth/props.imgWidth;
this.scaleY=props.cHeight/props.imgHeight;
this.imageData=props.opState.active.data;
this.saveNote=this.saveNote.bind(this);
this.state=({
imageNotes:this.props.opState.notes,
imgData:props.opState.active.data,width:props.cWidth,height:props.cHeight,original:props.opState.original,imgWidth:props.imgWidth,imgHeight:props.imgHeight});

}


updateCanvas(imgData,width,height){
this.imageData=imgData;

const ctx=this.refs.canvas.getContext('2d');

var image = new Image();
image.src="data:image/png;base64,"+this.imageData;
let root=this;
image.onload=function(){
root.image=image;
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

saveNote(){
const root=this;
console.log("Saving Note of ",this.state.imageNotes);
console.log("User id ",root.props.userinfo.userid);
console.log("Currnet ",root.props.imagesets.current);
console.log("Image Id ",root.props.opState.currentImageId);


axios.post(updatenoteURL,
{
note:root.state.imageNotes,
userid:root.props.userinfo.userid,
dataset:root.props.imagesets.current,
imageid:root.props.opState.currentImageId
}).then((response)=>response.data)
.catch((error)=>{
console.log("Error Alert ",error);
throw(error);
});

}
  render() {

console.log("Dataaaa",this.props.opState);
    return (
    <div id="stage">
     <div class="canvasParent" style={{textAlign: 'center'}}>

          <canvas ref="canvas" width={this.props.cWidth} height={this.props.cHeight} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseOut={this.handleMouseOut}
                onMouseMove={this.handleMouseMove}/>

<div style={{marginTop:10}}>
 <TextField
           defaultValue={this.state.imageNotes}
           floatingLabelText="Image Note"
           onChange = {(event,newValue) => this.setState({imageNotes:newValue})}
	mutliLine={true}
	rows={2}
	rowsMax={4}
	hintStyle={{fontSize:16}}
	floatingLabelStyle={{fontSize:16}}
           />

<div onClick={()=>this.saveNote()}>
 <FloatingActionButton style={{justifyContent:'flex-end'}}>
      <Save />
    </FloatingActionButton>
</div>

</div>
        </div>
	</div>
);
}
}


