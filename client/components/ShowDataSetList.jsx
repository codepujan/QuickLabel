import React from 'react';

import {render} from 'react-dom';

import './TodoList.css';

import Image from 'react-image-resizer';

import axios from 'axios';

const folderImageURL="http://icons.iconarchive.com/icons/custom-icon-design/flatastic-1/512/folder-icon.png";
const tagURL="http://icons.iconarchive.com/icons/pixelkit/gentle-edges/128/Tags-Flat-icon.png";
const classURL="https://d30y9cdsu7xlg0.cloudfront.net/png/321488-200.png";

let imageRequestURL="https://eskns.com/getDataSet/";

import { connect } from 'react-redux'
import { socketEmit } from 'redux-saga-sc'


const LOAD_DATASET_BY_ID="DATASET_REQUEST_BY_ID";

import {HashLoader} from 'react-spinners';


import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import LinearProgress from 'material-ui/LinearProgress';


const path_prefix = '/quicklabel';


const CHANGE_CURRENT_IMAGESET="CHANGE_CURRENT_IMAGESET"


import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {NAVIGATE_IMAGE_SET,NAVIGATE_CREATE_DATA_SET} from '../../reducers/actions_const';


const mapStateToProps = state => ({
 datasets:state.datasets,
 userinfo:state.userinfo 
});

const mapDispatchToProps=dispatch=>({
downloadInitial:(userId,clientId)=>dispatch({type:LOAD_DATASET_BY_ID,payload:{userid:userId,clientid:clientId}}),
navigateImageSets:()=>dispatch(push(`${path_prefix}/imageSets`)),
navigate:()=>dispatch({type:NAVIGATE_IMAGE_SET}),
navigateCreateDataSets:()=>dispatch(push(`${path_prefix}/createDataSet`)),
navigateDataSet:()=>dispatch({type:NAVIGATE_CREATE_DATA_SET}),
changeCurrentSet:(name)=>dispatch({type:CHANGE_CURRENT_IMAGESET,payload:name}),
communicate:()=>dispatch(socketEmit({
type:'CONNECTION'

}))
});


class ShowDataSets extends React.Component{

constructor(props,context){

super(props,context);
this.addItem=this.addItem.bind(this);

this.createTasks = this.createTasks.bind(this);
this.requestImages=this.requestImages.bind(this);

this.state={

items:[]

}

this.requestImages();
this.props.communicate();

}


requestImages(){

console.log("Logged in User ",this.props.userinfo.userid);
this.props.downloadInitial(this.props.userinfo.userid,this.props.userinfo.clientid.clientId);

}

 createTasks(item) {
console.log("Items",item);

     return(<li key={item.key}>
<div className="dataset" onClick={()=>{
this.props.changeCurrentSet(item.name);
this.props.navigate();
this.props.navigateImageSets()
}
}>
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

</div>
<br/>


<b>Description  :  </b>
{item.description}

<br/>
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

</li>);
}

addItem(e){


}
 render() {


console.log("Entries ",this.props.datasets);
var todoEntries=this.props.datasets.data;
var listItems = todoEntries.map(this.createTasks,this);
if(!this.props.datasets.loading){
return (
    <div id="container">

    <div className="todoListMain">

      <ul className="theList">
          {listItems}
      </ul>
   </div>

<div style={style} onClick={()=>{
this.props.navigateDataSet();
this.props.navigateCreateDataSets();
}}>
  <FloatingActionButton id="fab">
      <ContentAdd style={{position:'fixed'}}/>
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
  position:"fixed",
   bottom:10,
   right:10,
  justifyContent:'flex-end'
};

export default connect(
mapStateToProps,
mapDispatchToProps
)(ShowDataSets)
