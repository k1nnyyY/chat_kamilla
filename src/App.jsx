import React, { useContext, useEffect, useState } from 'react'
import './App.css'
import { ServiceContext } from './apolloClient.jsx';
import { GET_MY_DIALOGS_QUERY, RECEIVE_MESSAGE_SUBSCRIPTION, USER_PREVIEW_QUERY } from './query/queries.js';
import ChatPage from './pages/ChatPage';

function App() {
  const { client, webSocketClient } = useContext(ServiceContext);
  const [dialogs, setDialogs] = useState([]);
  const [user, setUser] = useState({});
  const [lastMessages, setLastMessages] = useState([])

  useEffect(()=>{
    client.query({
      query: GET_MY_DIALOGS_QUERY,
    }).then(response => {
      console.log(response.data.getMyDialogs);
      setDialogs(response.data.getMyDialogs);
      let lastMess = [];
      response.data.getMyDialogs.forEach((v,i)=>{
        console.log(v, i)
        lastMess.push({
          dialog: v.token,
          lastMessage: v.message?.message,
          ownerId: v.message?.ownerId,
          createdAt: v.message?.createdAt,
          isRead: v.message?.isRead,
        });
        console.log(lastMess)
      })
      setLastMessages(lastMess);
      console.log(lastMessages)

    }).catch(error => {
      console.log(error);
    });

    client.query({
      query: USER_PREVIEW_QUERY,
      variables: { asVIP: false },
      context: {
        clientName: 'search',
      },
    }).then(response => {
      console.log(response.data.userPreview);
      setUser(response.data.userPreview);
    }).catch(error => {
      console.log(error);
    });
  },[])


  return (
    <>
      <ChatPage lastMessages={lastMessages} setLastMessages={setLastMessages} dialogs={dialogs} setDialogs={setDialogs} user={user}></ChatPage>
    </>
  )
}

export default App
