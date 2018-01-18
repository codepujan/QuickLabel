import React from 'react';
import Hammer from 'react-hammerjs';

class MyCanvas extends React.Component{

render(){
console.log("Propss",this.props);
return(
<canvas ref={(node)=>{
this.props.childTrack(node);
}}
 width={600} height={600}/>

);
}

}





export default class HammerCanvas extends React.Component{

constructor(props){
super(props);
this.handlePinch=this.handlePinch.bind(this);
this.childCanvas={};
this.setchildCanvas=this.setchildCanvas.bind(this);
}


setchildCanvas(child){
this.childCanvas=child;
}

componentDidMount(){
console.log("component Mounted ");
console.log(this.childCanvas.getContext('2d'));
//const ctx=this.refs.hammer.canvas.getContext('2d');
//ctx.fillRect(20,20,550,550); 
}

handlePinch(){
console.log("Pincheededddd");

}

render(){

return(
<div  ref="hammer" style={{textAlign:'center'}}>
<Hammer
onPinch={this.handlePinch}
 options={{
       recognizers: {
          pinch: { enable: true }
       }
    }}
>
<MyCanvas childTrack={this.setchildCanvas}/>
</Hammer>
</div>);
}
}

