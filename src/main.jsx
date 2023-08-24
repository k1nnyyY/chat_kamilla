import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ApolloService from './apolloClient.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloService>
    <App />
  </ApolloService>
)
