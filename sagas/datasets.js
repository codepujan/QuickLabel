import {takeEvery,delay} from 'redux-saga';
import {put,call,fork} from 'redux-saga/effects';

let imageRequestURL="https://eskns.com/getDataSet/";

const DATASET_OBTAINED="DATASET_OBTAINED";
const DATASET_OBTAINED_FAILURE="DATASET_OBTAINED_FAILURE";
const DATASET_REQUEST_BY_ID="DATASET_REQUEST_BY_ID";
const DATASET_LOADING="DATASET_LOADING";


import axios from 'axios';



const getDataSetsApi=(userId)=>{
return  axios.get(imageRequestURL,
{
params:{
requestId:userId
}
}).then((response) =>response.data)
      .catch((error) => {
      console.log("Error Alert ",error);
	  throw(error);
      });
}



export function* requestDataSets(userId){

try{

yield put({type:DATASET_LOADING});
let sets=yield call(getDataSetsApi,userId.payload);


yield put({type:DATASET_OBTAINED,payload:sets});


}catch(err){

yield put({type:DATASET_OBTAINED_FAILURE,payload:err});

}
}


function* watchRequestDataSets(){

yield* takeEvery(DATASET_REQUEST_BY_ID,requestDataSets);

}

export default function* dataSets(){
yield fork(watchRequestDataSets);
} 

