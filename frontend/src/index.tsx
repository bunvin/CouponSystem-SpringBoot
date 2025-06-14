import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Layout from './Components/Layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux';
import { authStore } from './State/AuthState';
import { listStore } from './State/ListState';

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// if Token expired or unauthorized >> login page
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
           
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render( (
  <Provider store={listStore}>
  <Provider store={authStore}>
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
  </Provider>
  </Provider>
));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
