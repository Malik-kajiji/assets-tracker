import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AlertContext from './context/AlertContext';
import './styles/index.css';
import Alert from './components/Alert';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AlertContext>
    {/* <React.StrictMode> */}
        <Alert />
        <App />
    {/* </React.StrictMode> */}
  </AlertContext>
);


