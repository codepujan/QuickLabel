import {takeEvery,delay} from 'redux-saga';
import {put,call,fork} from 'redux-saga/effects';


let clientidRequestURL="https://eskns.com/getClientId";

const CLIENTID_RECIEVED="CLIENTID_RECIEVED";
const CLIENTID_FAILURE="CLIENTID_FAILURE";

const GET_CLIENTID="GET_CLIENTID";

import request from './request';

const APP_SITE='eskns.com'

const requestURL = `https://${APP_SITE}/getClientId`;


const options={
method:"GET",
credentials:'include'
};

const getClientID=()=>{
//return axios.get(clientidRequestURL,
//{
//withCredentials:true
//}).then((response)=>response.data)
//	.catch((error)=>{
//	console.log("Error Alert ",error);
//	throw(error);
//	});

return request(requestURL,options);
}



export function *requestClientId(){
try{
let clientId=yield call(getClientID);
console.log("Client ID recieved is ",clientId);

yield put({type:CLIENTID_RECIEVED,payload:clientId});
}catch(err){
yield put({type:CLIENTID_FAILURE});

}
}

function* watchClientIdRequest(){
yield* takeEvery(GET_CLIENTID,requestClientId);
}


export default function *utility() {
yield fork(watchClientIdRequest);
}
