import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';


import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
//import { Switch, Route } from 'react-router-dom';

import configureStore from '../store';



const initialState = {};

const history = createHistory();
const store = configureStore(initialState, history);

const path_prefix = '/quicklabel';




//MATERIAL DRAWER  

import AppMain from './AppMain.jsx';

const EditorIndexPage = (props) => {
return (
<EditorIndex
  store={store}
  {...props}
/>
);
}

///register

ReactDOM.render(
<Provider store={store}>
<ConnectedRouter history={history}>
<AppMain store={store}/>
</ConnectedRouter>
</Provider>,document.getElementById('root'));



