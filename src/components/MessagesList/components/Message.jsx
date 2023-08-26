import React, { useState, useEffect } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import styles from './Message.module.css';

import getM from '../../../assets/getM.png';
import sendM from '../../../assets/sendM.png';
import readM from '../../../assets/readM.png';

const Message = (props) => {
  const [originalStatus, setOriginalStatus] = useState(true)
  console.log(props)
  useEffect(()=>{
    if(props.readStatus.length>0){
      setOriginalStatus(false);
    }
  }, [props.readStatus])

  const data = props.info ? props.info : null;
  const inputDateString = data ? data?.message?.createdAt : null;
  const date = inputDateString ? parseISO(inputDateString) : null;
  const isTodayDate = date ? isToday(date) : null;
  const formattedTime = isTodayDate ? 
    format(date, 'HH:mm') 
    : 
      date?
        format(date, 'd MMMM')
      :
        null
  return formattedTime && data ?
    <div className={props.status===0?styles.main:styles.main_active}>
      <img src={`https://storage.yandexcloud.net/${data?.companion?.avatar?.path}`} className={styles.main__avatar} alt="" />
      <div className={styles.main__text}>
        <h5 className={styles.main__text_name}>{data?.companion?.firstname+' '+data?.companion?.lastname}</h5>
        <div className={styles.main__text_message}>
        {
          data?.message?.ownerId ===1?
          <h6 className={styles.main__text_message_who}>
            {'Я:'}&nbsp;
          </h6>
          :
          <h6 className={styles.main__text_message_who}>
            {data?.message?.owner?.firstname+':'}&nbsp;
          </h6>
        }
          <h6 className={styles.main__text_message}>
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
      </div>
      <div className={styles.info}>
      {
        originalStatus?
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
        :
          props.readStatus[props.readStatus.length-1]==='readMe'?
            <></>
          :
            <img src={readM} className={styles.status} alt="" />
        }
      <p className={styles.main__date}>{formattedTime}</p>
      </div>
    </div>
  :
  <></>
}

export default Message