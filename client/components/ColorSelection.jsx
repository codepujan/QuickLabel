import React from 'react';

import {render} from 'react-dom';

let labelsetAddURL="https://eskns.com/labelColor/";

import axios from 'axios';

export default class ColorSelection extends React.Component{


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
<div style={{marginTop:10}}>
No Class Labels Yet. Go to Settings Menu for Configuration
</div>
)

}else{

return(
 <ul>{listColors}</ul>
);

}

}



}
