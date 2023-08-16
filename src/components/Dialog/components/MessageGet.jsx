import React from 'react';
import styles from './MessageGet.module.css';

const MessageGet = () => {
  return (
    <div className={styles.main}>
        <div className={styles.main__message}>
            <div className={styles.main__message_text}>
              Привет, как у тебя дела? Слышал вы купили новую машину. Это правда???
              Привет, как у тебя дела? Слышал вы купили новую машину. Это правда???
              Привет, как у тебя дела? Слышал вы купили новую машину. Это правда???
            </div>
            <div className={styles.main__message_date}>
                00:23
            </div>
        </div>
    </div>
  )
}

export default MessageGet