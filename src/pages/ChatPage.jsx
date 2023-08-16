import React from 'react'
import styles from './ChatPage.module.css';
import MessageList from '../components/MessagesList/MessageList';
import Dialog from '../components/Dialog/Dialog';
const ChatPage = () => {
  return (
    <div className={styles.main}>
      <MessageList/>
      <Dialog/>
    </div>
  )
}

export default ChatPage