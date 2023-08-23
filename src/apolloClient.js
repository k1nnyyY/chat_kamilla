import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { WebSocketLink } from 'apollo-link-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { SubscriptionClient } from "subscriptions-transport-ws";
import { createClient } from 'graphql-ws';
// Middleware для добавления заголовка авторизации
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

const wsLink = new GraphQLWsLink(createClient({
uri: 'wss://korpustage.ru/dialogs', // URL вашего GraphQL WebSocket endpoint
  options: {
    reconnect: true,
    connectionParams: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkwNTQwMzA2LCJleHAiOjE2OTgzMTYzMDZ9.mTTzRDlPwrYXMzBxM-NHbA4uJP3TBHfxscB_D4ZzW3g', // Здесь передайте ваш accessToken
    },
  },
}));

// const wsLink = new WebSocketLink(
//   new SubscriptionClient("wss://korpustage.ru/dialogs", {
//     reconnect: false,
//     connectionParams: {
//       accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkwNTQwMzA2LCJleHAiOjE2OTgzMTYzMDZ9.mTTzRDlPwrYXMzBxM-NHbA4uJP3TBHfxscB_D4ZzW3g', // Здесь передайте ваш accessToken
//     },
//   })
// )

const searchLink = new HttpLink({
  uri: 'https://korpustage.ru/search'
});

const client = new ApolloClient({
  link:
      ApolloLink.split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            );
          },
          wsLink,
          ApolloLink.split(
          operation => operation.getContext().clientName === 'search',
          authLink.concat(searchLink), // if above 
          ApolloLink.split(
              operation => operation.getContext().clientName === 'storage',
              authLink.concat(storageLink),
              authLink.concat(httpLink)
          )   
          )
      ),
  cache: new InMemoryCache()
});
export default client;