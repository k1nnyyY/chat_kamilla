import React from 'react'
import styles from './Dialog.module.css';
import Avatar from '../MessagesList/images/avatar_h.jpg';
import Date from './components/Date';
import MessageSend from './components/MessageSend';
import MessageGet from './components/MessageGet';

const Dialog = () => {
  return (
    <div className={styles.main}>
      <div className={styles.main__head}>
        <img src={Avatar} className={styles.main__head_avatar} alt="" />
        <h4 className={styles.main__head_username}>Иван Иванов</h4>
      </div>
      <div className={styles.main__content}>
        <Date/>
        <MessageSend/>
        <MessageSend/>
        <MessageGet/>
        <Date/>
        <MessageSend/>
        <MessageGet/>
        <MessageGet/>
      </div>
      <div className={styles.main__head}>

      </div>
    </div>
  )
}

export default Dialog