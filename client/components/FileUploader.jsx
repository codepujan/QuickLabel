import React from 'react';

import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from 'react-fine-uploader'


// ...or load this specific CSS file using a <link> tag in your document
import 'react-fine-uploader/gallery/gallery.css'



import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';



import {NAVIGATE_IMAGE_SET} from '../../reducers/actions_const';

import {Link} from 'react-router-dom';

const path_prefix = '/quicklabel';


import { connect } from 'react-redux'

const mapStateToProps = state => ({
 imagesets:state.imagesets
});





/**
 const uploader = new FineUploaderTraditional({
    options: {
        chunking: {
            enabled: true
        },
        deleteFile: {
            enabled: true,
            endpoint: 'https://shipengers.com/fileUploader/'
        },
        request: {
            endpoint: 'https://shipengers.com/fileUploader/',
	    customHeaders:{'TestPoint':'Oblivion'}        
},
        retry: {
            enableAuto: false
        }
    }
})
**/




class UploadComponent extends React.Component {



constructor(props){
super(props);
this.uploader = new FineUploaderTraditional({
    options: {
        chunking: {
            enabled: true
        },
        deleteFile: {
            enabled: true,
            endpoint: 'https://eskns.com/fileUploader/'
        },
        request: {
            endpoint: 'https://eskns.com/fileUploader/',
            customHeaders:{'userId':'as131123','datasetId':props.imagesets.current}      
},
        retry: {
            enableAuto: false
        },
	validation:{
	allowedExtensions:['jpeg','jpg']

	}
    }
})




}
componentDidMount(){

this.uploader.on('statusChange',(id,oldStatus,newStatus)=>{
console.log(newStatus);

});

this.uploader.on('onError',function(id,name,errorReason){

console.log("OnError");
console.log(errorReason);

});

}
        render() {
        return (
	<div>
            <Gallery uploader={this.uploader} />
<Link to={`${path_prefix}/imageSets`}>
		<div class="fab">
  <FloatingActionButton style={style}>
      <CheckCircle />
    </FloatingActionButton>
</div>
</Link>
</div>
        )
    }
}



const style = {
  marginRight: 20,
};


export default connect(
mapStateToProps,
)(UploadComponent)

