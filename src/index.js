import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));


document.documentElement.className += (("ontouchstart" in document.documentElement) ? ' touch' : 'no-touch');