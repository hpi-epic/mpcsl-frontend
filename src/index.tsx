import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import './index.scss';
import { attachErrorHandler } from './errorHandling/errorHandler';

attachErrorHandler();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
