import * as reducers from './reducers'

import createSagaMiddleware from 'redux-saga'
import { applyMiddleware, createStore, combineReducers, compose } from 'redux'

import sagas from './sagas'

import { routerMiddleware } from 'react-router-redux';


const rootReducer = combineReducers(reducers)
const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState={},history){

const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
  ];

const enhancers = [
    applyMiddleware(...middlewares),
  ];

const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
       shouldHotReload: false,
       })
	:compose;


 const store=createStore(
    rootReducer,
    initialState,
    composeEnhancers(...enhancers)
  );

sagaMiddleware.run(sagas)

if ('production' !== process.env.NODE_ENV && module.hot) {
  // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
         /* eslint global-require: ["off"] */
             const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
                 })
        }
return store;
}
























/**
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware),
    'production' !== process.env.NODE_ENV && global.devToolsExtension ?
      global.devToolsExtension() :
      f => f
  )
)

sagaMiddleware.run(sagas)

if ('production' !== process.env.NODE_ENV && module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    /* eslint global-require: ["off"] */
/**
    const nextRootReducer = require('./reducers').default
    store.replaceReducer(nextRootReducer)
  })
}
export default store

**/
