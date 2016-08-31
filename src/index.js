import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import reducer from './reducer/index';
import App from './component/App'
import './index.css';


const store = createStore(reducer);

const render = () => {
  ReactDOM.render(
  	<Provider store={store}>
	    <App/>
    </Provider>,
    document.getElementById('root')
  )
};

store.subscribe(render);
render();