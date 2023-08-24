import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { ApolloProvider } from '@apollo/client';
import ApolloProvider from './apolloClient';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider>
    <App />
  </ApolloProvider>,
)