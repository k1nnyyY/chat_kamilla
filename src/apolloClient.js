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
const storageLink = new HttpLink({
  uri: 'https://korpustage.ru/storage'
});

const httpLink = new HttpLink({
  uri: 'https://korpustage.ru/dialogs',
  
});


const searchLink = new HttpLink({
  uri: 'https://korpustage.ru/search'
});

const client = new ApolloClient({
  link:
      ApolloLink.split(
          operation => operation.getContext().clientName === 'search',
          authLink.concat(searchLink), // if above 
          ApolloLink.split(
              operation => operation.getContext().clientName === 'storage',
              authLink.concat(storageLink),
              authLink.concat(httpLink)
          )
      ),
  cache: new InMemoryCache()
});
// // Объединение всех ссылок с выбором на основе имени клиента
// const link = ApolloLink.split(
//   operation => {
//     const clientName = operation.getContext().clientName;
//     switch (clientName) {
//       case 'storage':
//         return storageLink;
//       case 'search':
//         return searchLink;
//       default:
//         return httpLink;
//     }
//   },
//   authLink.concat(
//     httpLink
//   )
// );

// const client = new ApolloClient({
//   link: link,
//   cache: new InMemoryCache()
// });

export default client;