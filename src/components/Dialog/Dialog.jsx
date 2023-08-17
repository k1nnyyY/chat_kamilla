import React, { useState, useEffect, useRef } from 'react'
import styles from './Dialog.module.css';
import CusDate from './components/Date';
import MessageSend from './components/MessageSend';
import MessageGet from './components/MessageGet';

import Add from '../../assets/Add.png'
import Send from '../../assets/Send.png';

const Dialog = (props) => {
  const [message, setMessage] = useState('');
  const [animateBorder, setAnimateBorder] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Новое состояние
  const [rotateAddImage, setRotateAddImage] = useState(false);

  const handleImageUpload = (e) => {
      const newSelectedImage = e.target.files[0];
      if (newSelectedImage) {
        setSelectedImage(newSelectedImage);
        setRotateAddImage(true);
        console.log('Выбрано изображение:', newSelectedImage);
      } else {
        setSelectedImage(null);
        setRotateAddImage(false);
      }
  };    
  
  
  const handleMessage = (e) => {
    setMessage(e.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Предотвращаем перенос строки в инпуте
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (message.trim() === '' && selectedImage===null) {
      setAnimateBorder(true); // Устанавливаем состояние анимации
      setTimeout(() => {
        setAnimateBorder(false); // Сбрасываем состояние анимации через секунду
      }, 1000);
    } else {
      console.log(selectedImage, message);
      setSelectedImage(null)
      setRotateAddImage(false);
      setMessage('');
    }
  }
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
          <div className={styles.main__content_nothing}>
          Диалог не выбран.
          </div>
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
        {
          props.dialog?
          <>
<label htmlFor="imageInput" className={`${styles.imageInputWrapper} ${rotateAddImage ? styles.rotateImage : ''}`}>
  <img src={Add} className={`${styles.main__head_add} ${selectedImage ? styles.selectedImage : ''}`} alt="Add Image" />
  <input
    type="file"
    id="imageInput"
    className={styles.hiddenInput}
    onChange={handleImageUpload}
  />
</label>
          <input type="text" value={message} onKeyDown={handleKeyDown} onChange={e=>handleMessage(e)}  className={`${styles.main__head_input} ${animateBorder ? styles.animate_border : ''}`} placeholder='Введите сообщение...'/>
          
          <img src={Send} onClick={handleSubmit} className={styles.main__head_send} alt="" />
          
          </>
          :
          <></>
        }
      </div>
    </div>
  )
}

export default Dialog