import React, {useState} from 'react';
import styles from './MessageGet.module.css';

const MessageGet = (props) => {
  const [isImageFullscreen, setIsImageFullscreen] = useState(false); // Состояние для увеличенного изображения

  const handleImageClick = () => {
    setIsImageFullscreen(!isImageFullscreen);
  };

  return (
    <div className={styles.main}>
        <div className={styles.main__message}>
            <div className={styles.main__message_text}>
              {
                props.image===null?
                <></>
                :
                <>
                <img src={`https://storage.yandexcloud.net/${props.image.path}`} onClick={handleImageClick} className={styles.image} alt="" />
                <div className={styles.main__message_date_image}>
                {props.time}
                </div>

                </>
              }
              {props.text}
            </div>
            {
              props.image===null?
              <div className={styles.main__message_date}>
                {props.time}
              </div> 
                :
                <></>
            }
        </div>
        {isImageFullscreen && props.image !== null && (
        <div className={styles.imageFullscreenBackdrop} onClick={handleImageClick}>
          <img
            src={`https://storage.yandexcloud.net/${props.image.path}`}
            className={styles.imageFullscreen}
            alt=""
          />
        </div>
      )}
    </div>
  )
}

export default MessageGet