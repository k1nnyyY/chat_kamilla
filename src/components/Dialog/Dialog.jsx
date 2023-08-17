import React, { useState, useEffect, useRef } from 'react'
import styles from './Dialog.module.css';
import CusDate from './components/Date';
import MessageSend from './components/MessageSend';
import MessageGet from './components/MessageGet';

const Dialog = (props) => {
  const reversedMessages = props.messages.getMessages ? props.messages.getMessages.slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
  : null;

  const messagesContainerRef = useRef();
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
      console.log(props)
    }
  }, [reversedMessages]);

  return (
    <div className={styles.main}>
      <div className={styles.main__head}>
        {
          props.dialog?
          <>
          <img src={`https://storage.yandexcloud.net/${props.dialog.companion.avatar.path}`} className={styles.main__head_avatar} alt="" />
          <h4 className={styles.main__head_username}>{props.dialog.companion.firstname+' '+props.dialog.companion.lastname}</h4>
          </>
          :
          <></>
        }
      </div>
      <div ref={messagesContainerRef} className={styles.main__content}>
        {
          Array.isArray(props.messages) ?
          <></>
          :
          <>
          {reversedMessages.map(function(el,i){
            if(el.message===null && el.image===null){
              return(<></>)
            }
            const inputDateString = el.createdAt;
            const date = new Date(inputDateString);
          
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();
            console.log(props.messages)
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            if(el.ownerId===1){
              return(
                <MessageSend key={i} image={el.image} text={el.message} time={formattedTime}/>
              )
            }
            return(
              <MessageGet key={i} image={el.image}text={el.message} time={formattedTime}/>
            )
          })

          }
          </>
        }
      </div>
      <div className={styles.main__head}>
        <input type="text" className={styles.main__head_input} placeholder='Введите сообщение...'/>
      </div>
    </div>
  )
}

export default Dialog