import {takeEvery,delay} from 'redux-saga';
import {put,call,fork} from 'redux-saga/effects';

let imageRequestURL="https://eskns.com/imagesbyDataSet/";

const IMAGESET_OBTAINED="IMAGESET_OBTAINED";
const IMAGESET_OBTAINED_FAILURE="IMAGESET_OBTAINED_FAILURE";
const IMAGESET_REQUEST_BY_DATASET="IMAGESET_REQUEST_BY_DATASET";

const IMAGESET_LOADING="IMAGESET_LOADING";


import axios from 'axios';

const getImageSetsApi=(dataSetId,userId,clientId,pageState)=>{

console.log("SAGAS REQUESTING ",imageRequestURL);
console.log("Page State is ",pageState);

return axios.post(imageRequestURL,
{
dataset:dataSetId,
userid:userId,
clientId:clientId,
pagestate:pageState
}).then((response)=>response.data).catch((error)=>{
console.log("Error Alert ",error);
throw(error);
});
}

export function* requestImageSets(data){
try{

if(data.payload.pageState=="start") // if it's the first time  only then loading 
yield put({type:IMAGESET_LOADING});


let sets=yield call(getImageSetsApi,data.payload.dataSetId,data.payload.userId,data.payload.clientid,data.payload.pageState);



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
