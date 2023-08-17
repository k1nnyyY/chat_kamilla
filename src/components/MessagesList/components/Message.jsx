import React, { useState } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import styles from './Message.module.css';
const Message = (props) => {
  const data = props.info;
  const inputDateString = data.message.createdAt;
  const date = parseISO(inputDateString); // Преобразуем строку в объект Date
  console.log(inputDateString)
  // Проверяем, сегодняшняя ли это дата
  const isTodayDate = isToday(date);
  console.log(inputDateString)

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
        data.message.image?
        'Изображение'
        :
        data.message.message
        }
        </h6>
      </div>
      <p className={styles.main__date}>{formattedTime}</p>
    </div>
  )
}

export default Message