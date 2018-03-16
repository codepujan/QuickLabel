//Some sort of initial Color 
let initialColor="#999999";
let CHANGE_COLOR="COLOR_CHANGE";
let initialClass="";
let initial={color:initialColor,label:initialClass}
export const colors=(state=initial, action) => {
  switch (action.type) { 
  case CHANGE_COLOR:{
    console.log("CHANGING_COLOR",action.payload);
	return Object.assign({},state,{color:action.payload.color,label:action.payload.label});
}
default:
    return state
  }
}

