import React, { useState, useEffect, useContext } from 'react'
import styles from './ChatPage.module.css';
import MessageList from '../components/MessagesList/MessageList';
import Dialog from '../components/Dialog/Dialog';
import { ServiceContext } from './../apolloClient.jsx';
import { GET_MESSAGES_QUERY, READ_MESSAGES_MUTATION } from "./../query/queries";

const ChatPage = (props) => {
  const { client } = useContext(ServiceContext);

  const [selectedDialogToken, setSelectedDialogToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [readStatus, setReadStatus] = useState([])
  const [newMessage, setNewMessage] = useState([]);



  useEffect(()=>{
    let nonReadedMessagesId = null;
    client.query({
      query: GET_MESSAGES_QUERY,
      variables: {
          page: 1,
          size: 100,
          dialog: selectedDialogToken?.token || "",
      }
    }).then(response => {
      console.log(response.data.getMessages);
      const nonReadedMessages = response?.data?.getMessages?.filter((val,i,arr)=>{
        return !val.isRead&&val.ownerId!==props.user.id;
      });
      nonReadedMessagesId = nonReadedMessages?.map(obj=>obj.id);
      if(nonReadedMessagesId && typeof selectedDialogToken.token === 'string' && nonReadedMessages.length>0){
        client.mutate({
          mutation: READ_MESSAGES_MUTATION,
          variables: {
            messagesId: nonReadedMessagesId,
            dialog: selectedDialogToken?.token,
          },
        }).then(response => {
          if(response.data.readMessages){
            readStatus.push({
              dialog: selectedDialogToken.token,
              status: 'readMe',
            });
          };
          console.log('Mutation response:', response);
        }).catch(error => {
          console.error('Mutation error:', error, nonReadedMessagesId, selectedDialogToken?.token);
        });
      }
      console.log(nonReadedMessagesId)
      setMessages(response.data);
    }).catch(error => {
      console.log(error);
    });

  },[selectedDialogToken])

  useEffect(()=>{
    console.log(props.lastMessages)
  }, [props.lastMessages])


  return (
    <div className={styles.main}>
      <MessageList lastMessages={props.lastMessages} setLastMessages={props.setLastMessages}  readStatus={readStatus} user={props.user} newMessage={newMessage} setDialogs={props.setDialogs} dialogs={props.dialogs} setToken={setSelectedDialogToken}/>
      <Dialog lastMessages={props.lastMessages} setLastMessages={props.setLastMessages} dialog={selectedDialogToken} messages={messages?messages:''} newMessage={newMessage} user={props.user} setDialogs={props.setDialogs}/>
    </div>
  )
}

export default ChatPage;
