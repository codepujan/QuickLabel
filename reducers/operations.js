//Maybe the initial state should  be some localimag e, saying Instructipn or sth like that 
let initialState={image:{},boundary:[],currentImageId:'',original:{},width:0,height:0,active:{},segmented:true};
export const operations=(state=initialState, action) => {
console.log("Answer Type",action.type);
console.log("New Reply I got ",action.payload);
  switch (action.type) {
  case 'REPLY':{
  return Object.assign({},state,{image:action.payload,boundary:[],original:action.payload.orgi,width:action.payload.width,height:action.payload.height,active:action.payload.data});
}
case 'BOUNDARY':{
console.log("Boundary Data I Got ",action.payload);
return {
...state,
boundary:[...state.boundary,action.payload.data]
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
  return Object.assign({},state,{active:action.payload.data});
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

default:
    return state
  }
}

