import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function nolog() {}

if (process.env.NODE_ENV !== 'development') {
    console.log = nolog;
    console.warn = nolog;
    console.error = nolog;
}

ReactDOM.render(<App />, document.getElementById('root'));
