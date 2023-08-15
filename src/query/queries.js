// queries.js
import gql from 'graphql-tag';

export const USER_PREVIEW_QUERY = gql`
  query UserPreview($asVIP: Boolean!) {
    userPreview(asVIP: $asVIP) {
      avatar {
        path
      }
      status {
        value
      }
      id
      phoneNumber
      firstname
      lastname
    }
  }
`;
