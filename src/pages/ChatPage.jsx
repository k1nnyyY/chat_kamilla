import React, { useState, useEffect } from 'react'
import styles from './ChatPage.module.css';
import MessageList from '../components/MessagesList/MessageList';
import Dialog from '../components/Dialog/Dialog';
import { useQuery } from "@apollo/client";
import { GET_MESSAGES_QUERY } from "./../query/queries";

const ChatPage = (props) => {
  const [selectedDialogToken, setSelectedDialogToken] = useState(null);
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState([]);

  const { loading: loadingMessages, error: errorMessages, data: dataMessages } = useQuery(GET_MESSAGES_QUERY, {
    variables: {
      page: 1,
      size: 30,
      dialog: selectedDialogToken?.token || "", // Проверка наличия токена
    },
    context: {
      clientName: 'default'
    },
    skip: !selectedDialogToken, // Пропуск запроса, если нет токена
});

  useEffect(() => {
    if (!loadingMessages && !errorMessages && selectedDialogToken !== null) {
      setMessages(dataMessages);
    }
  }, [loadingMessages, errorMessages, dataMessages, selectedDialogToken]);

  console.log(messages, selectedDialogToken);

  return (
    <div className={styles.main}>
      <MessageList user={props.user} newMessage={newMessage} dialogs={props.dialogs} setToken={setSelectedDialogToken}/>
      <Dialog dialog={selectedDialogToken} messages={messages?messages:''} newMessage={newMessage}/>
    </div>
  )
}

export default ChatPage;
