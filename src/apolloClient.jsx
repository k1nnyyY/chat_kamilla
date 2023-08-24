import React from 'react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from "subscriptions-transport-ws";

export const ServiceContext = React.createContext();

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkwNTQwMzA2LCJleHAiOjE2OTgzMTYzMDZ9.mTTzRDlPwrYXMzBxM-NHbA4uJP3TBHfxscB_D4ZzW3g"
    }
  });
  return forward(operation);
});

const storageLink = new HttpLink({
  uri: 'https://korpustage.ru/storage'
});

const httpLink = new HttpLink({
  uri: 'https://korpustage.ru/dialogs',  
});

const searchLink = new HttpLink({
  uri: 'https://korpustage.ru/search'
});

const wsLink = new WebSocketLink(
  new SubscriptionClient("wss://korpustage.ru/dialogs", {
    reconnect: true,
    connectionParams: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkwNTQwMzA2LCJleHAiOjE2OTgzMTYzMDZ9.mTTzRDlPwrYXMzBxM-NHbA4uJP3TBHfxscB_D4ZzW3g', // Здесь передайте ваш accessToken
    },
  })
)


const client = new ApolloClient({
  link:
      ApolloLink.split(
          operation => operation.getContext().clientName === 'search',
          authLink.concat(searchLink), // if above 
            ApolloLink.split(
                operation => operation.getContext().clientName === 'storage',
                authLink.concat(storageLink),
                authLink.concat(httpLink))), 
  cache: new InMemoryCache()
});

const webSocketClient = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
})

const ServiceProvider = ({ children }) => {
  return (
    <ServiceContext.Provider
      value={{
        client,
        webSocketClient
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
export default ServiceProvider;