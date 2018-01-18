import React from 'react';

import {render} from 'react-dom';


export default class ColorSelection extends React.Component{


constructor(props){
super(props);
this.state={
classLabels:[{label:"corridor",hex:'#4D4D4D'},{label:"door",hex:'#999999'},{label:"window",hex:'#FFFFFF'},{label:"obstacle",hex:'#F44E3B'},{label:"pavement",hex:'#FE9200'}]
}
this.createColorsList=this.createColorsList.bind(this);
this.changeCurrentColor=this.changeCurrentColor.bind(this);

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
return(
 <ul>{listColors}</ul>
);
}
}
