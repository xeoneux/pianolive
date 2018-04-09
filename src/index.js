import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'unstated';

import './index.css';
import App from './components/App';
import { keysContainer } from './containers/Keys';
import { roomContainer } from './containers/Room';

ReactDOM.render(
  <Provider inject={[keysContainer, roomContainer]}>
    <App />
  </Provider>,
  document.getElementById('root')
);
