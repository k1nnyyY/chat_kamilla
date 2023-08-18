import React, { useState } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import styles from './Message.module.css';

import getM from '../../../assets/getM.png';
import sendM from '../../../assets/sendM.png';
import readM from '../../../assets/readM.png';


const Message = (props) => {
  const data = props.info;
  const inputDateString = data.message.createdAt;
  const date = parseISO(inputDateString); // Преобразуем строку в объект Date
  console.log(inputDateString)
  // Проверяем, сегодняшняя ли это дата
  const isTodayDate = isToday(date);
  console.log(inputDateString)
  console.log(props.newMessage.token,props.info.token,props.newMessage.message)
  // Форматируем дату в зависимости от того, сегодняшняя она или нет
  const formattedTime = isTodayDate
    ? format(date, 'HH:mm') // Сегодня - часы и минуты
    : format(date, 'd MMMM');
  return (
    
    <div className={props.status===0?styles.main:styles.main_active}>
      <img src={`https://storage.yandexcloud.net/${data.companion.avatar.path}`} className={styles.main__avatar} alt="" />
      <div className={styles.main__text}>
        <h5>{data.companion.firstname+' '+data.companion.lastname}</h5>
        <h6 className={styles.main__text_message}>
        {
          data.message.ownerId ===1?
          <h6 className={styles.main__text_message_who}>
            {'Я:'}&nbsp;
          </h6>
          :
          <h6 className={styles.main__text_message_who}>
            {data.message.owner.firstname+':'}&nbsp;
          </h6>
        }

        {
        data.message.image && props.newMessage[0]===undefined?
        'Изображение'
        :
        props.newMessage[0]===undefined?
        data.message.message
        :
        props.newMessage.token===props.info.token?
        props.newMessage.message
        :
        data.message.message
        }
        </h6>
      </div>
      <div className={styles.info}>

      {
        props.user.id===data.message.ownerId?
        !data.message.isRead?
        <img src={sendM} className={styles.status} alt="" />
        :
        <img src={readM} className={styles.status} alt="" />
        :
        !data.message.isRead?
        <img src={getM} className={styles.status} alt="" />
        :
        <></>
      }
      <p className={styles.main__date}>{formattedTime}</p>
      </div>
    </div>
  )
}

export default Message