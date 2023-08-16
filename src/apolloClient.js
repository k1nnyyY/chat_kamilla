import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// Middleware для добавления заголовка авторизации
const authLink = new ApolloLink((operation, forward) => {
  // Используйте заголовок авторизации с вашим токеном
  operation.setContext({
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkwNTQwMzA2LCJleHAiOjE2OTgzMTYzMDZ9.mTTzRDlPwrYXMzBxM-NHbA4uJP3TBHfxscB_D4ZzW3g`
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
  // Выбираем ссылку на основе операции GraphQL
  (operation) => {
    const operationName = operation.operationName;

    if (operationName === 'storageOperation') {
      return storageLink;
    } else if (operationName === 'dialogsOperation') {
      return dialogsLink;
    } else {
      return httpLink;
    }
  },
  authLink.concat(httpLink), // Используем httpLink по умолчанию для остальных операций
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

export default client;
