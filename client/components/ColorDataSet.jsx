import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { CirclePicker  } from 'react-color';

import ReactTable from "react-table";

import axios from 'axios';

import { connect } from 'react-redux';


let labelsetAddURL="https://eskns.com/labelColor/";


const mapStateToProps = state => ({
imagesets:state.imagesets
})


const mapDispatchToProps = dispatch => ({



})


class ColorDataSet extends React.Component{

constructor(props){
super(props);
this.handleAddNewColor=this.handleAddNewColor.bind(this);
 this.state={
	pickerColors:['#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF'],
	newPickingColor:'',
	newPickingClass:'',
	//textdset:[{label:"Cat",hex:"#999999"},{label:"Dog",hex:"#AEA1FF"}]    
	textdset:[]
	}
this.handleColorChange=this.handleColorChange.bind(this);
this.handleSendServer=this.handleSendServer.bind(this);
this.downloadLabelSettings=this.downloadLabelSettings.bind(this);

//TODO : SAGIFY EVERYHdownloadLabelSetings(); 

this.downloadLabelSettings();

}




downloadLabelSettings(){

//labelsetAddURL
//TODO : DATABASE PARAMS : 

axios.get(labelsetAddURL,{params:{database:this.props.imagesets.current}}).then((response) =>{

//response.data
console.log("Color Set ",response.data);

//TODO : Move this thing also to Sagas 
let labelSet=[];
for(var i=0;i<response.data.length;i++){
labelSet.push({label:response.data[i].label,hex:response.data[i].colorhex});
}


this.setState({textdset:labelSet});
})
      .catch((error) => {
      console.log("Error Alert ",error);
          throw(error);
 });





}
createExistingColor(color){
return(
<tr>
<td>{color.label}</td>

<div id="labelColor">
<div style={{backgroundColor:color.hex,width:'150px',height:'50px'}}></div>
</div>
</tr>
);
}


handleSendServer(){


console.log("Label",this.state.newPickingClass);
console.log("Color",this.state.newPickingColor);
let newLabel=this.state.newPickingClass;
let newColor=this.state.newPickingColor;
let refer=this;
let newArray=this.state.textdset;
axios.post(labelsetAddURL,
{
dataSetName:'',
label:newLabel,
colorhex:newColor
}).then((response)=>{

console.log("Response",response);

newArray.push({label:newLabel,hex:newColor});

//let newArray=refer.state.textdset({label:newLabel,hex:newColor});
console.log("new set",refer.state.textdset); 
refer.setState({textdset:newArray})
}).catch((error) => {
      console.log("Error Alert ",error)
          throw(error)
      })
}


handleAddNewColor(){

console.log("Adding Color "+this.state.newPickingColor);
let newArray=this.state.pickerColors;
newArray.push(this.state.newPickingColor);
this.setState({pickerColors:newArray});
console.log("Check"+this.state.pickerColors);
}

handleColorChange(color,event){

this.setState({newPickingColor:color.hex});


}
render() {
console.log(this.state.textdset);
let colorEntries=this.state.textdset.map(this.createExistingColor);

    return (
	
     <div id="colorstage">
        <div className="existingTable">
	<b> Existing Labels </b>
	<br/> <br/>
	<table>
	<tr>
	<th>Label </th>
	<th> Color </th>
	</tr>
	{colorEntries}
	</table>	
	</div>

       <MuiThemeProvider>	
	<div>
	<b> Create New Label</b> <br/> <br/>
	 <TextField
           hintText="Enter Label of your Class "
           floatingLabelText="Class Name"
           onChange = {(event,newValue) => this.setState({newPickingClass:newValue})}
           />
	<br/>
	<div>
	<CirclePicker  onChange={ this.handleColorChange } colors={this.state.pickerColors} color={this.state.newPickingColor}/>
         <TextField
           hintText="Enter Color Not in the List "
           floatingLabelText="New Color"
           onChange = {(event,newValue) => this.setState({newPickingColor:newValue})}  	/>
	 <br/>
	
           <RaisedButton label="Add Color " primary={true} style={style} onClick={(event) =>this.handleAddNewColor()}/>
	
	</div>
           <RaisedButton label="Add Label " primary={true} style={style} onClick={(event) => this.handleSendServer()}/>
       </div>
       </MuiThemeProvider>


        </div>);
  }
}


const style = {
  margin: 15,
};


export default connect(
mapStateToProps,
mapDispatchToProps)(ColorDataSet)
