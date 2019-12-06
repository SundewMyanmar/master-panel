import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import MenuReducer from './redux/MenuRedux';
import UserReducer from './redux/UserRedux';
import RoleReducer from './redux/RoleRedux';
import FileReader from './redux/FileRedux';

const reducers = combineReducers({
	menu: MenuReducer,
	user:UserReducer,
	role: RoleReducer,
	file: FileReader,
});

const store = createStore(reducers);

function nolog() {}

if(process.env.NODE_ENV !== 'development'){
	console.log = nolog;
	console.warn = nolog;
	console.error = nolog;
}

ReactDOM.render(<Provider store = {store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
