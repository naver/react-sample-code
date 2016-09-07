import React from 'react';
import configStore from './store/index';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import reducer from './reducer/index';
import App from './component/App'
import './index.css';

const store = configStore(reducer);

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