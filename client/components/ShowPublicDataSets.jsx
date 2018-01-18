import React from 'react';

import {render} from 'react-dom';

import './TodoList.css';

import Image from 'react-image-resizer';

import axios from 'axios';

const folderImageURL="http://icons.iconarchive.com/icons/custom-icon-design/flatastic-1/512/folder-icon.png";

const userIconURL="https://cdn2.iconfinder.com/data/icons/flat-style-svg-icons-part-2/512/search_people_find-512.png";

const imageRequestURL="https://eskns.com/getDataSet/";

const tagURL="http://icons.iconarchive.com/icons/pixelkit/gentle-edges/128/Tags-Flat-icon.png";
const classURL="https://d30y9cdsu7xlg0.cloudfront.net/png/321488-200.png";


import { connect } from 'react-redux'

const LOAD_DATASET_BY_ID="DATASET_REQUEST_BY_ID";

import {HashLoader} from 'react-spinners';


import StackGrid from "react-stack-grid";


import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import LinearProgress from 'material-ui/LinearProgress';

import {Link} from 'react-router-dom';

const path_prefix = '/quicklabel';



import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


const mapStateToProps = state => ({
 datasets:state.datasets
});


import {NAVIGATE_IMAGE_SET,NAVIGATE_CREATE_DATA_SET} from '../../reducers/actions_const';

console.log("Constant",NAVIGATE_CREATE_DATA_SET);

//path={`${path_prefix}/imageSets`}
const mapDispatchToProps=dispatch=>({
downloadInitial:(userId,datasetId)=>dispatch({type:LOAD_DATASET_BY_ID,payload:userId}),
navigateImageSets:()=>dispatch(push(`${path_prefix}/imageSets`)),
navigate:()=>dispatch({type:NAVIGATE_IMAGE_SET}),
navigateCreateDataSets:()=>dispatch(push(`${path_prefix}/createDataSet`)),
navigateDataSet:()=>dispatch({type:NAVIGATE_CREATE_DATA_SET})
});


class ShowPublicDataSets extends React.Component{

constructor(props,context){

super(props,context);
this.addItem=this.addItem.bind(this);

this.createTasks = this.createTasks.bind(this);
this.requestImages=this.requestImages.bind(this);

this.state={

items:[]

}

this.requestImages();

}


requestImages(){

this.props.downloadInitial(-1); // Since this is public stuff 

}

createTasks(item) {

     return(
<div className="dataset" onClick={()=>{
this.props.navigate();
this.props.navigateImageSets()

}
} style={{marginLeft:10,marginTop:10}}>
<div id="rowStuff">

<Image src={folderImageURL}
width={50}
height={50}
/>
<div style={{marginTop:15,marginLeft:15}}>
<b>
{item.name} 
</b>

</div>

<Image src={userIconURL} style={{marginLeft:15}}
width={50}
height={50}
/>
<b>
<div style={{marginLeft:15,marginTop:15}}>
{item.userid} 
</div>
</b>
</div>
<br/>
<b>Description  :  </b>
{item.description} 

<br/>
<LinearProgress mode="determinate" min={0} max={item.total}  value={item.completed}/>

<br/>

<div id="rowStuff" style={{marginTop:10}}>
<Image src={classURL}
width={50}
height={50}
style={{marginRight:15}}
/>

<div style={{marginLeft:15,marginTop:10}}>
<b>

{item.classes.join()}
</b>
</div>

</div>

<div id="rowStuff" style={{marginTop:10}}>
<Image src={tagURL}
width={40}
height={40}
style={{marginRight:15}}
/>


<div style={{marginLeft:15,marginTop:10}}>
<b>
{item.tags.join()}
</b>
</div>
</div>




</div>
);
}

addItem(e){


}
 render() {


var todoEntries=this.props.datasets.data;
var listItems = todoEntries.map(this.createTasks,this);
if(!this.props.datasets.loading){
return (

<div>
<StackGrid id="hzgrid" columnWidth={450}>
{listItems}
</StackGrid>
<div onClick={()=>{
this.props.navigateDataSet();
this.props.navigateCreateDataSets();
}}>
  <FloatingActionButton style={style}>
      <ContentAdd />
    </FloatingActionButton>
</div>
        </div>
    );
}else{

console.log("Loading Bruhhh!!! ");

return (<div class='loader'>
	<HashLoader size={200} color={'#123abc'}
	loading={true}/>
	</div>);
}

}

}


const style = {
  position:"absolute",
   bottom:0,
   right:0,
  marginRight: 20,
  marginBottom:20,
  justifyContent:'flex-end'
};

export default connect(
mapStateToProps,
mapDispatchToProps
)(ShowPublicDataSets)
