let initialStage="register"; // means that we aint loading anything at the beginning 
let initialtitle="Register";

let initialState={stage:initialStage,title:initialtitle};

import {NAVIGATE_LOGIN,NAVIGATE_EDITOR,NAVIGATE_REGISTER,NAVIGATE_CREATE_DATA_SET,NAVIGATE_DATA_SET,NAVIGATE_PUBLIC_DATA_SET,NAVIGATE_IMAGE_SET,NAVIGATE_IMAGE_UPLOADER,NAVIGATE_SETTINGS} from './actions_const';

export const navigationState=(state=initialState, action) => {
  switch (action.type) {
  case NAVIGATE_LOGIN:{
        return {stage:"login",title:"Login"}
}
 case NAVIGATE_EDITOR:{

return {stage:"editor",title:"Segmentation Editor"}

}

case NAVIGATE_REGISTER:{

return{stage:"register",title:"Register"}

}

case NAVIGATE_CREATE_DATA_SET:{
return{stage:"createset",title:"Create Data Set "}
}

case NAVIGATE_DATA_SET:{

return {stage:"listset",title:"Your Data Sets"}

}


case NAVIGATE_PUBLIC_DATA_SET:{

return {stage:"publicdatasets",title:"Public Data Sets"}
}

case NAVIGATE_IMAGE_SET:{
return {stage:"imageset",title:"Image Set"}

}


case NAVIGATE_IMAGE_UPLOADER:{

return{stage:"imageuploader",title:"Upload New Images"}

}

case NAVIGATE_SETTINGS:{

return {stage:"settings",title:"Settings"}

}


default:
    return state
  }
}
