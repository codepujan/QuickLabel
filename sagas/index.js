import {fork} from 'redux-saga/effects';
import scsagas from './sc';
import dataSets from './datasets';
import imageSets from './datasetimages';

/**
 *
 * rootSaga
 *
 */

export default function* root(){

yield fork(scsagas);
yield fork(dataSets);
yield fork(imageSets);
}
