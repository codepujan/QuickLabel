import React from 'react';

import {render} from 'react-dom';

import './TodoList.css';

import Image from 'react-image-resizer';

import StackGrid from "react-stack-grid";


let imageRequestURL="https://eskns.com/fileUploader/";

let folderImageURL="https://maxcdn.icons8.com/Share/icon/p1em/Very_Basic//folder1600.png";

import {Link} from 'react-router-dom';


import {HashLoader} from 'react-spinners';

import ScaledImage from 'react-image-resizer';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const path_prefix = '/quicklabel';

import axios from 'axios';

const downloadSingleURL="https://eskns.com/downloadSingleImage/";
const getUserMeta="https://eskns.com/getMetaData/";
 
import { connect } from 'react-redux'
const IMAGESET_REQUEST_BY_DATASET="IMAGESET_REQUEST_BY_DATASET";
const SET_EDITOR_IMAGE="EDITOR_IMAGE";

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'


import {NAVIGATE_EDITOR,NAVIGATE_IMAGE_UPLOADER} from '../../reducers/actions_const';


import FileSaver from 'file-saver';

const mapStateToProps = state => ({
 imagesets:state.imagesets,
 userinfo:state.userinfo
});

 let b64toBlob=require('b64-to-blob');
  let contentType='image/png';


const mapDispatchToProps=dispatch=>({

downloadInitial:(userId,datasetId,clientId)=>dispatch({type:IMAGESET_REQUEST_BY_DATASET,payload:{userId:userId,dataSetId:datasetId,clientid:clientId}}),
setEditorImage:(imageId)=>dispatch({type:SET_EDITOR_IMAGE,payload:imageId}),
navigateEditor:()=>dispatch(push(`${path_prefix}/editor`)),
navigate:()=>dispatch({type:NAVIGATE_EDITOR}),
navigateCreateNew:()=>dispatch(push(`${path_prefix}/imageUploader`)),
navigateNew:()=>dispatch({type:NAVIGATE_IMAGE_UPLOADER}),
freshenUpState:()=>dispatch({type:'CLEAR'})

});


class ShowDataSetImage extends React.Component{

constructor(props,context){

super(props,context);

this.requestImages=this.requestImages.bind(this);
this.state={
currentPage:0,
offset:0,
requestSize:5,
imageBuffers:[],
}
this.props.freshenUpState();
this.requestImages();
this.navigateImage=this.navigateImage.bind(this);
this.downloadSingleImage=this.downloadSingleImage.bind(this);
this.requestLastWorkingImage=this.requestLastWorkingImage.bind(this);
this.lastActive='';
this.lastbase64='';
}



downloadSingleImage(imageid){


axios.post(downloadSingleURL,
{
dataset:this.props.imagesets.current,
userId:this.props.userinfo.userid,
clientId:this.props.userinfo.clientid.clientid,
imageId:imageid
}).then((response)=>{

console.log(response.data);

let blob=b64toBlob(response.data,contentType);
FileSaver.saveAs(blob,"firstDownload.jpg");
}).catch((error)=>{
console.log("Error Alert ",error);
throw(error);

});

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

this.requestLastWorkingImage();

}

requestLastWorkingImage(){

console.log("Requesting Last Working Image ");

axios.post(getUserMeta,
{
userid:this.props.userinfo.userid,
}).then((response)=>{
console.log("Meta - Data ",response.data);
this.lastActive=response.data.lastactiveimage;

}).catch((error)=>{
console.log("Meta Data Error Alert ",error);
throw(error);

});



}




createCompletedImages(item){
console.log(item);
if(item.imageId==this.lastActive){
this.lastbase64=item.data;
}

if(item.completed==0)
return;

return(
<div id="thumbnailDataSetImage">
        
<div onClick={()=>{this.navigateImage(item.imageId)}}>
<Image src={"data:image/png;base64,"+item.data}
width={400}
height={200}
>

</Image>

</div>
<div style={{marginTop:10}} onClick={()=>{this.downloadSingleImage(item.imageId)}}>

<ScaledImage src={require('../../images/Download.png')}
width={40}
height={40}
/>
</div>

</div>
);

}

createIncompleteImages(item){
console.log(item);
if(item.imageId==this.lastActive){
this.lastbase64=item.data;
}
if(item.completed==1)
return;

return(
<div id="thumbnailDataSetImage">

<div onClick={()=>{this.navigateImage(item.imageId)}}>
<Image src={"data:image/png;base64,"+item.data}
width={400}
height={200}
>

</Image>

</div>
<div style={{marginTop:10}} onClick={()=>{this.downloadSingleImage(item.imageId)}}>

<ScaledImage src={require('../../images/Download.png')}
width={40}
height={40}
/>
</div>

</div>
);




}

 render() {
console.log("Loading",this.props.imagesets.loading);

if(!this.props.imagesets.loading){
let imageEntries=this.props.imagesets.data;

let completedItems=imageEntries.map(this.createCompletedImages,this);

let incompleteItems=imageEntries.map(this.createIncompleteImages,this);

return (

<div>

<div>
<div style={{fontSize:18,color:'blue',fontWeight:'bold'}}>
Previously Working Image : </div>
<br/>
<div id="lastWorkingImage">
<div onClick={()=>{this.navigateImage(item.lastActive)}}>
<Image src={"data:image/png;base64,"+this.lastbase64}
width={400}
height={200}
>

</Image>

</div>

</div>
</div>

<div style={{fontSize:18,color:'blue',fontWeight:'bold'}}>
Incomplete  Images : </div>
<br/>
 <StackGrid id="hzgrid" columnWidth={400}
      >	{completedItems};
</StackGrid>


<br/>

<div style={{fontSize:18,color:'blue',fontWeight:'bold'}}>
Completed Images : </div>
<br/>
<StackGrid id="hzgrid" columnWidth={400}
      > {incompleteItems};
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

