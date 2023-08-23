// App.jsx
import { useQuery } from "@apollo/client";
import { USER_PREVIEW_QUERY, GET_MY_DIALOGS_QUERY, GET_CHAT_ROOMS_QUERY } from "./query/queries";
import ChatPage from "./pages/chatPage";
import Submit from './components/Dialog/components/Submit.jsx';


const App = () => {
  const { loading: loadingDialogs, error: errorDialogs, data: dataDialogs } = useQuery(GET_MY_DIALOGS_QUERY,{
    context: {
      clientName: 'default'
    }
  
  }
  );
  const { loading: loadingChatRooms, error: errorChatRooms, data: dataChatRooms } = useQuery(GET_CHAT_ROOMS_QUERY,{
    context: {
      clientName: 'default'
    }
  
  });
  
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(USER_PREVIEW_QUERY, {
    variables: { asVIP: false },
    context: {
      clientName: 'search'
    }
  });
  if (loadingDialogs || loadingChatRooms ) return <p>Loading...</p>;
  if (errorDialogs) return <p>Error: {errorDialogs.message}</p>;
  if (errorChatRooms) return <p>Error: {errorChatRooms.message}</p>;
  
  if (loadingUser) return <p>Loading...</p>;
  if (errorUser) return <p>Error: {errorUser.message}</p>;
  const user = dataUser.userPreview;
  console.log(user);
  const dialogs = dataDialogs.getMyDialogs;
  const chatRooms = dataChatRooms.getChatRooms;
  
  console.log(dialogs, chatRooms);  


  return (
    <>
      <ChatPage user={user} dialogs={dialogs}/>
      {/* <Submit></Submit> */}
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
