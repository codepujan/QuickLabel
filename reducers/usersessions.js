let userInfo={userid:{}};

const SET_CURRENT_USER_ID="SET_CURRENT_USERID";

export const userinfo=(state=userInfo,action)=>
{
switch(action.type){
case SET_CURRENT_USER_ID:{
return Object.assign({},state,{userid:action.payload});
}
default:
	return state
}

}
