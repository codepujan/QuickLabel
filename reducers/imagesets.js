const IMAGESET_OBTAINED="IMAGESET_OBTAINED";
const IMAGESET_OBTAINED_FAILURE="IMAGESET_OBTAINED_FAILURE";
const IMAGESET_LOADING="IMAGESET_LOADING";
const CHANGE_CURRENT_IMAGESET="CHANGE_CURRENT_IMAGESET"


let initialImageSet={loading:false,data:[],current:"",pageState:"start"};

export const imagesets=(state=initialImageSet,action)=>{
switch (action.type) {
  case IMAGESET_OBTAINED:{
  if(action.payload===undefined)
        return state;

//action.payload.data , has the data part 
//pageState has the part needed for pagination 

let nextpage=action.payload.state===null?"start":action.payload.state;


console.log("Reducer NExt Page State is ",nextpage);


return {
...state,
data:[...state.data,action.payload.data],
pageState:nextpage,
loading:false
};

}

case IMAGESET_OBTAINED_FAILURE:{

console.log("Oh No !! Some sort of Network Failure my Boy ");
return state;
}

case IMAGESET_LOADING:{

return Object.assign({},state,{loading:true});

}


case CHANGE_CURRENT_IMAGESET:{
console.log("Changing Current Active Dtaabase ",action.payload);

return Object.assign({},state,{current:action.payload,data:[]})
}
default:
    return state
  }
};
