let initialState=false; // means that we aint loading anything at the beginning 

const gotSomeData="REPLY";
const changeToLoad="LOADING";

export const appState=(state=initialState, action) => {
  switch (action.type) {
  case changeToLoad:{
        return true;
}
 case gotSomeData:{
	return false;
}
default:
    return state
  }
}

