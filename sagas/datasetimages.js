import {takeEvery,delay} from 'redux-saga';
import {put,call,fork} from 'redux-saga/effects';

let imageRequestURL="https://eskns.com/fileUploader/";

const IMAGESET_OBTAINED="IMAGESET_OBTAINED";
const IMAGESET_OBTAINED_FAILURE="IMAGESET_OBTAINED_FAILURE";
const IMAGESET_REQUEST_BY_DATASET="IMAGESET_REQUEST_BY_DATASET";

const IMAGESET_LOADING="IMAGESET_LOADING";


import axios from 'axios';

const getImageSetsApi=(dataSetId,userId)=>{

console.log("SAGAS REQUESTING ",imageRequestURL);

return axios.get(imageRequestURL,
{
params:{
dataset:dataSetId,
userid:userId
}
}).then((response)=>response.data).catch((error)=>{
console.log("Error Alert ",error);
throw(error);
});
}

export function* requestImageSets(data){
console.log(data.payload.dataSetId);
console.log(data.payload.userId);
try{

yield put({type:IMAGESET_LOADING});
let sets=yield call(getImageSetsApi,data.payload.dataSetId,data.payload.userId);


yield put({type:IMAGESET_OBTAINED,payload:sets});


}catch(err){

yield put({type:IMAGESET_OBTAINED_FAILURE,payload:err});

}
}

function* watchRequestImageSets(){

yield* takeEvery(IMAGESET_REQUEST_BY_DATASET,requestImageSets);

}


export default function* imageSets(){

yield fork(watchRequestImageSets);

}
