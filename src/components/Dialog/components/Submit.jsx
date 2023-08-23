import React from 'react';
import { Mutation } from '@apollo/client/react/components';
import gql from 'graphql-tag';

const UploadFileComponent = () => {
    const SEND_IMAGE_MUTATION = gql`
    mutation SendImage($input: SendImageInput!) {
      sendImage(input: $input) {
        eventId
        id
        path
        sequence
        status
      }
    }
  `;
  
  const handleFileChange = async (event, singleUploadStream) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { data } = await singleUploadStream({variables: {
        input: {
          file: file,
          companion: 3,
          dialogToken: '1:3',
        },
      },
      context: {
        clientName: 'storage', // Your client name here
      },});
      console.log('File upload response:', data);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  return (
    <Mutation mutation={SEND_IMAGE_MUTATION}>
      {(singleUploadStream, { loading }) => (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            console.log('Submitted');
          }}
          encType="multipart/form-data"
        >
          <input
            name="document"
            type="file"
            onChange={(event) => handleFileChange(event, singleUploadStream)}
          />
          {loading && <p>Loading.....</p>}
        </form>
      )}
    </Mutation>
  );
};

export default UploadFileComponent;
