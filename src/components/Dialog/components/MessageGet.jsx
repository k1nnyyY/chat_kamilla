import React from 'react';
import styles from './MessageGet.module.css';

const MessageGet = (props) => {
  return (
    <div className={styles.main}>
        <div className={styles.main__message}>
            <div className={styles.main__message_text}>
              {props.text}
            </div>
            <div className={styles.main__message_date}>
                {props.time}
            </div>
        </div>
    </div>
  )
}

export default MessageGet