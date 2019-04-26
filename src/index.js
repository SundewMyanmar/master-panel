import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import MenuReducer from './redux/MenuRedux';
import UserReducer from './redux/UserRedux';

const reducers = combineReducers({
	menu: MenuReducer,
	user:UserReducer
});

const store = createStore(reducers);

ReactDOM.render(<Provider store = {store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();