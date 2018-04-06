import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'unstated';

import './index.css';
import App from './components/App';
import { keysContainer } from './containers/Keys';

ReactDOM.render(
  <Provider inject={[keysContainer]}>
    <App />
  </Provider>,
  document.getElementById('root')
);
