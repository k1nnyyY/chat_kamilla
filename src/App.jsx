// App.jsx
import { useQuery } from "@apollo/client";
import { USER_PREVIEW_QUERY, GET_MY_DIALOGS_QUERY, GET_CHAT_ROOMS_QUERY } from "./query/queries";
import ChatPage from "./pages/chatPage";
function App() {

  const { loading: loadingDialogs, error: errorDialogs, data: dataDialogs } = useQuery(GET_MY_DIALOGS_QUERY,
);
  const { loading: loadingChatRooms, error: errorChatRooms, data: dataChatRooms } = useQuery(GET_CHAT_ROOMS_QUERY);

  if (loadingDialogs || loadingChatRooms ) return <p>Loading...</p>;
  if (errorDialogs) return <p>Error: {errorDialogs.message}</p>;
  if (errorChatRooms) return <p>Error: {errorChatRooms.message}</p>;

  const dialogs = dataDialogs.getMyDialogs;
  const chatRooms = dataChatRooms.getChatRooms;

  console.log(dialogs, chatRooms);  // const { loading, error, data } = useQuery(USER_PREVIEW_QUERY, {
  //   variables: { asVIP: false },
  // });
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  // const user = data.userPreview;
  // console.log(user);




  return (
    <>
      <ChatPage dialogs={dialogs}/>
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
