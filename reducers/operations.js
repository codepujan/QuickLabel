let initialState={image:{},boundary:[],currentImageId:'',original:{},width:0,height:0,active:{},segmented:true,notes:'',activeboundaryIndex:0,instanceColors:[]};
const INCREASE_HISTORY_INDEX='INCREASE_HISTORY_INDEX';
const DECREASE_HISTORY_INDEX='DECREASE_HISTORY_INDEX';

export const operations=(state=initialState, action) => {
console.log("Answer Type",action.type);
console.log("New Reply I got ",action.payload);
  switch (action.type) {
  case 'REPLY':{
  return Object.assign({},state,{image:action.payload,boundary:[],original:action.payload.orgi,width:action.payload.width,height:action.payload.height,active:action.payload.data,notes:action.payload.note,instanceColors:action.payload.instanceColors});
}

case INCREASE_HISTORY_INDEX:{
return{
...state,
activeboundaryIndex:state.activeboundaryIndex+1
}
}
case DECREASE_HISTORY_INDEX:{
return{
...state,
activeboundaryIndex:state.activeboundaryIndex-1
}
}

case 'BOUNDARY':{
console.log("Boundary Data I Got ",action.payload);

let splicedArray=state.boundary
splicedArray.splice(state.activeboundaryIndex); // up till the last 

console.log("Spliced Array is ",splicedArray);

return {
...state,
activeboundaryIndex:state.activeboundaryIndex+1,
boundary:[...splicedArray,action.payload.data]
}
}

case 'CLEAR_BOUNDARY':{
return{
...state,
boundary:[]
}
}


case 'CHANGE':{

console.log("Changing Image ");

if(state.segmented){
console.log("Returning Original Image ");
return Object.assign({},state,{active:state.original,segmented:false});
}
else
{
console.log("Returning Segmented Image");
return Object.assign({},state,{active:state.image.data,segmented:true});
}
}

case 'OPERATE':{
  return Object.assign({},state,{active:action.payload.data,boundary:[],activeboundaryIndex:0});
}

case 'EDITOR_IMAGE':
{
return Object.assign({},state,{currentImageId:action.payload});
}

case 'LOADER':
{
console.log("Loader",action.payload.orgi);

return Object.assign({},state,{image:action.payload,boundary:[],original:action.payload.orgi});

}

case 'CLEAR':
{
console.log("Freshening Up State ");

return Object.assign({},initialState);

}

default:
    return state
  }
}

