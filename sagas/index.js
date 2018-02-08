import {fork} from 'redux-saga/effects';
import scsagas from './sc';
import dataSets from './datasets';
import imageSets from './datasetimages';
import utility from './utility';

//yield fork (scsagas ) 

export default function* root(){
yield fork(scsagas);
yield fork(dataSets);
yield fork(imageSets);
yield fork(utility);
}
