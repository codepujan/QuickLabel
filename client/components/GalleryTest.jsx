import React from 'react';
import { render } from 'react-dom';
import Gallery from 'react-grid-gallery';

const IMAGES =
[{
        src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
},
{
        src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
},

{
        src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
}]

export default class GalleryTest extends React.Component{

render(){
return(
        <Gallery images={IMAGES}/>);
}
}
