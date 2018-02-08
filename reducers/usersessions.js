let userInfo={userid:{},clientid:''};

const SET_CURRENT_USER_ID="SET_CURRENT_USERID";

const CLIENTID_RECIEVED="CLIENTID_RECIEVED";

export const userinfo=(state=userInfo,action)=>
{
switch(action.type){
case SET_CURRENT_USER_ID:{
return Object.assign({},state,{userid:action.payload});
}

case CLIENTID_RECIEVED:{
return Object.assign({},state,{clientid:action.payload});
}
default:
	return state
}

}
