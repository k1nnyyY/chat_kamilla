import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// Middleware для добавления заголовка авторизации
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkwNTQwMzA2LCJleHAiOjE2OTgzMTYzMDZ9.mTTzRDlPwrYXMzBxM-NHbA4uJP3TBHfxscB_D4ZzW3g"
    }
  });
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: 'https://korpustage.ru/dialogs'
});

const storageLink = new HttpLink({
  uri: 'https://korpustage.ru/storage'
});

const dialogsLink = new HttpLink({
  uri: 'https://korpustage.ru/search'
});

// Объединение всех ссылок
const link = ApolloLink.split(
  operation => operation.operationName === 'storageOperation',
  authLink.concat(storageLink),
  ApolloLink.split(
    operation => operation.operationName === 'dialogsOperation',
    authLink.concat(dialogsLink),
    authLink.concat(httpLink)
  )
);


const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

export default client;