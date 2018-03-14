//Some sort of initial Color 
let initialColor="#999999";
let CHANGE_COLOR="COLOR_CHANGE";
let initialClass="";
let initial={color:initialColor,class:initialClass}
export const colors=(state=initialColor, action) => {
  switch (action.type) { 
  case CHANGE_COLOR:{
    console.log("CHANGING_COLOR",action.payload);
	return action.payload;
}
default:
    return state
  }
}

