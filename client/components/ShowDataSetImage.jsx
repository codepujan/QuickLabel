import React from 'react';

import {render} from 'react-dom';

import './TodoList.css';

import Image from 'react-image-resizer';

import StackGrid from "react-stack-grid";

import axios from 'axios';

let imageRequestURL="https://eskns.com/fileUploader/";

let folderImageURL="https://maxcdn.icons8.com/Share/icon/p1em/Very_Basic//folder1600.png";

import {Link} from 'react-router-dom';


import {HashLoader} from 'react-spinners';


import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const path_prefix = '/quicklabel';


import { connect } from 'react-redux'
const IMAGESET_REQUEST_BY_DATASET="IMAGESET_REQUEST_BY_DATASET";
const SET_EDITOR_IMAGE="EDITOR_IMAGE";

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'


import {NAVIGATE_EDITOR,NAVIGATE_IMAGE_UPLOADER} from '../../reducers/actions_const';



const mapStateToProps = state => ({
 imagesets:state.imagesets,
 userinfo:state.userinfo
});



const mapDispatchToProps=dispatch=>({

downloadInitial:(userId,datasetId,clientId)=>dispatch({type:IMAGESET_REQUEST_BY_DATASET,payload:{userId:userId,dataSetId:datasetId,clientid:clientId}}),
setEditorImage:(imageId)=>dispatch({type:SET_EDITOR_IMAGE,payload:imageId}),
navigateEditor:()=>dispatch(push(`${path_prefix}/editor`)),
navigate:()=>dispatch({type:NAVIGATE_EDITOR}),
navigateCreateNew:()=>dispatch(push(`${path_prefix}/imageUploader`)),
navigateNew:()=>dispatch({type:NAVIGATE_IMAGE_UPLOADER})
});


class ShowDataSetImage extends React.Component{

constructor(props,context){

super(props,context);
this.addItem=this.addItem.bind(this);

this.createTasks = this.createTasks.bind(this);
this.requestImages=this.requestImages.bind(this);
this.state={
currentPage:0,
offset:0,
requestSize:5,
imageBuffers:[]
}

this.requestImages();
this.navigateImage=this.navigateImage.bind(this);


}



navigateImage(imageId){

console.log("going to the editor View with iMage Id of ",imageId);
this.props.setEditorImage(imageId);
console.log("now hope navigating works ");

this.props.navigate();
this.props.navigateEditor();

}

requestImages(){
console.log("Requesting Image to ",imageRequestURL);

console.log("Dataset Name ",this.props.imagesets.current);

this.props.downloadInitial(this.props.userinfo.userid,this.props.imagesets.current,this.props.userinfo.clientid.clientId);

}

 createTasks(item) {
     return(<li key={item.key}>

<Image src={item.data} 
width={100}
height={100}
/>
{item.text}
</li>);
}

addItem(e){


}


createImages(item){
console.log(item);

return(
<div id="thumbnailDataSetImage" onClick={()=>{this.navigateImage(item.imageId)}}>
        <Image src={"data:image/png;base64,"+item.data}
width={400}
height={200}
>

</Image>

</div>
);

}

 render() {
console.log("Loading",this.props.imagesets.loading);

if(!this.props.imagesets.loading){
let imageEntries=this.props.imagesets.data;
//since loading has also been added to the reducer 

let imageItems=imageEntries.map(this.createImages,this);

return (
<div>
 <StackGrid id="hzgrid" columnWidth={400}
      >	{imageItems};
</StackGrid>



<div onClick={()=>{
this.props.navigateNew();
this.props.navigateCreateNew();
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
)(ShowDataSetImage)

