import React from 'react';

import {render} from 'react-dom';

let labelsetAddURL="https://eskns.com/labelColor/";

import axios from 'axios';
 
import Image from 'react-image-resizer';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import { connect } from 'react-redux';
const NAVIGATE_SETTINGS="NAVIGATE_SETTINGS";


const mapStateToProps= state =>({


})


const mapDispatchToProps= dispatch => ({
navigateSettings:()=>dispatch({type:NAVIGATE_SETTINGS}),
gotocolorSettings:()=>dispatch(push(`${path_prefix}/settings`))
})

const path_prefix = '/quicklabel';

class ColorSelection extends React.Component{


constructor(props){
super(props);
this.state={
classLabels:[]
}
this.createColorsList=this.createColorsList.bind(this);
this.changeCurrentColor=this.changeCurrentColor.bind(this);
this.downloadLabelSettings();

} 


downloadLabelSettings(){
console.log("Downloading Label Settings ");

axios.get(labelsetAddURL,{params:{database:this.props.currentDatabase}}).then((response) =>{
let labelSet=[];
for(var i=0;i<response.data.length;i++){
labelSet.push({label:response.data[i].label,hex:response.data[i].colorhex});
}
this.setState({classLabels:labelSet});
})

}
changeCurrentColor(changeColor){
this.props.colorAction(changeColor);

}

createColorsList(item){
return(
<div>
{item.label}
<br/>
<div id="pickColor" onClick={(event)=>this.changeCurrentColor(item.hex)}>
<div style={{backgroundColor:item.hex,width:'150px',height:'50px'}}></div>
</div>
</div>
);
}

render(){
let mClassLabels=this.state.classLabels;
let listColors=mClassLabels.map(this.createColorsList);
if(mClassLabels.length==0){
return(
<div style={{width:600,marginTop:30 ,flexDirection:'row'}}>
<div>No Class Labels Yet.Configure
</div>
<div onClick={(event)=>{
console.log("Going to color Settings ");
this.props.navigateSettings();
this.props.gotocolorSettings();
}}>
<Image src={require('../../images/Settings.png')}
width={40}
height={40}
/>
</div>
</div>
)

}else{

return(
<div className="colorBox">
 <ul>{listColors}</ul>
</div>

);

}

}



}


export default connect(
mapStateToProps,
mapDispatchToProps)(ColorSelection)
