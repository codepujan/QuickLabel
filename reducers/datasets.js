let initialDataSet={loading:false,data:[]};

const DATASET_RECIEVED="DATASET_OBTAINED";
const DATASET_OBTAINED_FAILURE="DATASET_OBTAINED_FAILURE";
const DATASET_LOADING="DATASET_LOADING";


export const datasets=(state=initialDataSet, action) => {
  switch (action.type) {
  case DATASET_RECIEVED:{
  console.log("Yehooo ! I got the list of those data Sets  ",action.payload);
  if(action.payload===undefined)
	return state;

//Should add to gthe data 
//TODO : Add data to the array

  return Object.assign({},state,{loading:false,data:action.payload});

}
case DATASET_OBTAINED_FAILURE:{

console.log("Oh No !! Some sort of Network Failure my Boy ");
return state;
}

case DATASET_LOADING:{
return Object.assign({},state,{loading:true});

}

default:
    return state
  }
}
