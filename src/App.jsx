// App.jsx
import { useQuery } from "@apollo/client";
import { USER_PREVIEW_QUERY, GET_MY_DIALOGS_QUERY } from "./query/queries";
import ChatPage from "./pages/chatPage";
import Logo from "./assets/logo.png";
function App() {

  // const { loading, error, data } = useQuery(GET_MY_DIALOGS_QUERY);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  // const dialogs = data.getMyDialogs;


  // const { loading, error, data } = useQuery(USER_PREVIEW_QUERY, {
  //   variables: { asVIP: false },
  // });
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  // const user = data.userPreview;
  // console.log(user);




  return (
    <>
      <ChatPage />
      {/* <div>
        <img src={user.avatar.path} alt="User Avatar" />
      </div>
      <h1>
        {user.firstname} {user.lastname}
      </h1>
      <p>ID: {user.id}</p>
      <p>Phone: {user.phoneNumber}</p>
      <p>Status: {user.status.value}</p> */}
    </>
  );
}

export default App;
