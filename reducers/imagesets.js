const IMAGESET_OBTAINED="IMAGESET_OBTAINED";
const IMAGESET_OBTAINED_FAILURE="IMAGESET_OBTAINED_FAILURE";
const IMAGESET_LOADING="IMAGESET_LOADING";
const CHANGE_CURRENT_IMAGESET="CHANGE_CURRENT_IMAGESET"

let initialImageSet={loading:false,data:[],current:""};

export const imagesets=(state=initialImageSet,action)=>{
switch (action.type) {
  case IMAGESET_OBTAINED:{
  if(action.payload===undefined)
        return state;

console.log("Got From Server",action.payload);
return Object.assign({},state,{loading:false,data:action.payload});



}case IMAGESET_OBTAINED_FAILURE:{

console.log("Oh No !! Some sort of Network Failure my Boy ");
return state;
}

case IMAGESET_LOADING:{

return Object.assign({},state,{loading:true});

}

case CHANGE_CURRENT_IMAGESET:{
return Object.assign({},state,{current:action.payload})
}
default:
    return state
  }
};
