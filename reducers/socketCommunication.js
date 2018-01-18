let initialState={communicationId:''}
export const communication=(state=initialState, action) => {
switch (action.type) {
  case 'CONNECTID':{
console.log("Got Connect Id ",action.payload);
return Object.assign({},{communicationId:action.payload});
 }

default:
    return state

}

}
