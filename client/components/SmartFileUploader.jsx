import React from 'react';

import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from 'react-fine-uploader'

import FileInput from 'react-fine-uploader/file-input'


// ...or load this specific CSS file using a <link> tag in your document
import 'react-fine-uploader/gallery/gallery.css'

const uploader = new FineUploaderTraditional({
    options: {
        chunking: {
            enabled: true
        },
        deleteFile: {
            enabled: true,
            endpoint: 'http://czd.gestaltgroup.io:8000/uploads'
        },
        request: {
            endpoint: 'http://czd.gestaltgroup.io:8000/uploads'
        },
        retry: {
            enableAuto: false
        }
    }
})

class UploadComponent extends React.Component {

componentDidMount(){

uploader.on('statusChange',(id,oldStatus,newStatus)=>{
console.log(newStatus);

});

uploader.on('onError',function(id,name,errorReason){

console.log("OnError");
console.log(errorReason);

});

}
        render() {
        return (
                <FileInput multiple accept='image/*' uploader={ uploader }>
      <span class="icon ion-upload">Choose Files</span>
   </FileInput>

        )
    }
}




export default UploadComponent

