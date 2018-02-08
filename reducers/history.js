let initialState={activeboundaryIndex:0,totalBoundaries:0}
const GET_BOUNDARY='BOUNDARY';
const INCREASE_HISTORY_INDEX='INCREASE_HISTORY_INDEX';
const DECREASE_HISTORY_INDEX='DECREASE_HISTORY_INDEX';

export const history=(state=initialState,action)=>{
switch(action.type){
case 'BOUNDARY':{
return{
...state,
totalBoundaries:state.totalBoundaries+1,
activeboundaryIndex:state.totalBoundaries+1
}
}

case INCREASE_HISTORY_INDEX:{
console.log("Increasing History Index ");
return{
...state,
activeboundaryIndex:state.activeboundaryIndex+1
}
}
case DECREASE_HISTORY_INDEX:{
console.log("Decreasing History Index ");
return{
...state,
activeboundaryIndex:state.activeboundaryIndex-1
} 
}

default:
	return state
}
} 
