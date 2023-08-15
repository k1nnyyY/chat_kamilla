// App.jsx
import { useQuery } from '@apollo/client';
import { USER_PREVIEW_QUERY } from './query/queries';

function App() {
  const { loading, error, data } = useQuery(USER_PREVIEW_QUERY, {
    variables: { asVIP: false }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data.userPreview;

  return (
    <>
      <div>
        <img src={user.avatar.path} alt="User Avatar" />
      </div>
      <h1>{user.firstname} {user.lastname}</h1>
      <p>ID: {user.id}</p>
      <p>Phone: {user.phoneNumber}</p>
      <p>Status: {user.status.value}</p>
      {/* ... остальная часть вашего кода ... */}
    </>
  );
}

export default App;
