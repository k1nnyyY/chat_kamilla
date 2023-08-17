import React, { useState } from 'react'
import styles from './Message.module.css';
const Message = (props) => {
  const data = props.info;
  const inputDateString = data.message.createdAt;
  const date = new Date(inputDateString);

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  console.log(date)
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return (
    
    <div className={props.status===0?styles.main:styles.main_active}>
      <img src={`https://storage.yandexcloud.net/${data.companion.avatar.path}`} className={styles.main__avatar} alt="" />
      <div className={styles.main__text}>
        <h5>{data.companion.firstname+' '+data.companion.lastname}</h5>
        <h6 className={styles.main__text_message}>{
        data.message.image?
        'Изображение'
        :
        data.message.message
        }</h6>
      </div>
      <p className={styles.main__date}>{formattedTime}</p>
    </div>
  )
}

export default Message