import React, { useState } from 'react'
import styles from './Message.module.css';
import Avatar from '../images/avatar_h.jpg';
const Message = (props) => {
  console.log(props)
  return (
    
    <div className={props.status===0?styles.main:styles.main_active}>
      <img src={Avatar} className={styles.main__avatar} alt="" />
      <div className={styles.main__text}>
        <h5>Иван Иванов</h5>
        <h6>Привет! Не отвлекаю?</h6>
      </div>
      <p className={styles.main__date}>00:23</p>
    </div>
  )
}

export default Message