import React, { useState, useEffect, useRef } from 'react'
import styles from './Dialog.module.css';
import CusDate from './components/Date';
import MessageSend from './components/MessageSend';
import MessageGet from './components/MessageGet';
import { useMutation, useSubscription } from '@apollo/client';
import { Mutation } from 'react-apollo';
import { SEND_MESSAGE_MUTATION, SEND_IMAGE_MUTATION, RECEIVE_MESSAGE_SUBSCRIPTION } from '../../query/queries.js';
import { format } from 'date-fns';

import Add from '../../assets/Add.png'
import Send from '../../assets/Send.png';

const Dialog = (props) => {
  const [message, setMessage] = useState('');
  const [animateBorder, setAnimateBorder] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Новое состояние
  const [rotateAddImage, setRotateAddImage] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [showMessages, setShowMessages] = useState(true);
  const [localMess, setLocalMess] = useState([]);
  
  const { data, loading, error } = useSubscription(RECEIVE_MESSAGE_SUBSCRIPTION, {
  });
    if (loading) {
    return <p>Loading...</p>;
  }
  
  if(error){
    return <p>Error {error.message}</p>
  }
  
  // if(data){
  //   return <p>{data}</p>
  // }

  let currentDate = '';
  let stepDate = '';

  useEffect(() => {
    if (props.dialog === null) {
      setShowMessages(false);
    } else {
      setShowMessages(true);
    }
  }, [props.dialog]);


  const handleImageUpload = (e) => {
      const newSelectedImage = e.target.files[0];
      if (newSelectedImage instanceof File) {
        setSelectedImage(newSelectedImage);
        setSelectedImagePreview(URL.createObjectURL(newSelectedImage));
        setRotateAddImage(true);
        console.log('Выбрано изображение:', newSelectedImage);
      } else {
        setSelectedImage(null);
        setSelectedImagePreview(null);
        setRotateAddImage(false);
      }
  };  
  
  const handleClearFiles = () => {
    setSelectedImage(null);
    setSelectedImagePreview(null);
    setRotateAddImage(false);
  };
  
  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Предотвращаем перенос строки в инпуте
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (message.trim() === '' && selectedImage===null) {
      if(animateBorder){
        return
      }
      setAnimateBorder(true); // Устанавливаем состояние анимации
      setTimeout(() => {
        setAnimateBorder(false); // Сбрасываем состояние анимации через секунду
      }, 1000);
    } else {
      console.log(props.dialog)
      try {
        if(message.trim() !== ''){
        const response = await sendMessageMutation({
          variables: {
            input: {
              message: message,
              companion: props.dialog.companion.id,
              dialogToken: props.dialog.token,
            },
          },
          context: {
            clientName: 'default'
          }      
        });
        console.log('Message sent:', response.data.sendMessage);

      }
        if(selectedImage instanceof File){
          const response = await sendImageMutation({
            variables: {
              input: {
                file: selectedImage,
              }
            },
            context: {
              clientName: 'storage'
            }
          })
          console.log('Image sent:', response.data.sendMessage);
        }
        // Do something with the response if needed
        setSelectedImage(null)
        setRotateAddImage(false);
        setSelectedImagePreview(null)
        setMessage('');
  
        const date = Date.now();
            
        const formattedTime = format(date, 'HH:mm');
        props.newMessage.push({
          message: message,
          createdAt: formattedTime,
          image: null,
          type: 'send',
          token: props.dialog.token,
        });
        localMess.push({
          message: message,
          createdAt: formattedTime,
          image: null,
          type: 'send',
          token: props.dialog.token,
        });
        console.log('HEEEEE',localMess)
      } catch (error) {
        // Handle errors if needed

        console.error('Error sending message:', error);
      }
      console.log(selectedImage.file, message);
      setSelectedImage(null)
      setRotateAddImage(false);
      setSelectedImagePreview(null)
      setMessage('');
    }
  }
  let reversedMessages = props.messages.getMessages ? props.messages.getMessages.slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
  : null;

  const messagesContainerRef = useRef();
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [reversedMessages]);
  const [sendMessageMutation] = useMutation(SEND_MESSAGE_MUTATION);
  const [sendImageMutation] = useMutation(SEND_IMAGE_MUTATION);
  return (
    <div className={styles.main}>
      <div className={styles.main__head_top}>
        {
          props.dialog?
          <>
            <img src={`https://storage.yandexcloud.net/${props.dialog.companion.avatar.path}`} className={styles.main__head_avatar} alt="" />
            <h4 className={styles.main__head_username}>{props.dialog.companion.firstname+' '+props.dialog.companion.lastname}</h4>
          </>
          :
          <>
          </>
        }
      </div>
      {
        !showMessages && (
          <div className={styles.main__content}>
            <div className={styles.main__content_nothing}>
              Диалог не был найден.
            </div>
          </div>
        )
      }
      { showMessages && (
      <div ref={messagesContainerRef} className={styles.main__content}>
        {
          Array.isArray(props.messages) && props.dialog!==null?
            <div className={styles.main__content_nothing}>
              Диалог не выбран.
            </div>
          :
          <>
          {reversedMessages?.map(function(el,i){
            if(el.message===null && el.image===null){
              return(
                <>
                </>
              )
            }
            const inputDateString = el.createdAt;
            const date = new Date(inputDateString);
            const formattedTime = format(date, 'HH:mm');
            const formattedDate = format(date, 'dd-MM-yyyy');
            currentDate = stepDate;
            if(formattedDate!==currentDate){
              stepDate = formattedDate;
            };
            if(el.ownerId===1){
              return(
                  formattedDate!==currentDate?
                  <>
                    <CusDate date={el.createdAt}/>
                    <MessageSend element={el} key={i} image={el.image} text={el.message} time={formattedTime}/>
                  </>
                  :
                  <>
                    <MessageSend element={el} key={i} image={el.image} text={el.message} time={formattedTime}/>
                  </>
                
              )
            }
            return(
              formattedDate!==currentDate?
              <>
                <CusDate date={el.createdAt}/>
                <MessageGet key={i} image={el.image} text={el.message} time={formattedTime}/>
              </>
              :
              <>
                <MessageGet key={i} image={el.image} text={el.message} time={formattedTime}/>
              </>
            )
          })
        }
           {
            localMess ?
            <>
              {
                localMess?.map((el,i)=>{
                  if(el.token===props.dialog.token){
                    return (
                      <MessageSend key={i} element={el} image={el.image} text={el.message} time={el.createdAt}/>
                      )
                  }
                })
              }
            </>
            :
            <>
            </>
          }
          </>
        }
      </div> )}
      <div className={styles.main__head}>
      {selectedImagePreview && (
        <div className={styles.selectedImagePreview}>
          <img src={selectedImagePreview} alt="Selected" className={styles.previewImage} />
        </div>
      )}
        {
          selectedImage?  
          <div className={styles.main__head_filename}>
            {selectedImage.name}
          </div>
          :
          ''
        }
        { 
          props.dialog?
          <div className={styles.main__head_div}>
            <label htmlFor="imageInput" className={`${styles.imageInputWrapper} ${rotateAddImage ? styles.rotateImage : ''}`}>
              <img src={Add} onClick={selectedImage?handleClearFiles:''} className={`${styles.main__head_add} ${selectedImage ? styles.selectedImage : ''}`} alt="Add Image" />
              {
                selectedImage?
                <></>
                :
              <input
                type="file"
                accept="image/jpeg"
                id="imageInput"
                className={styles.hiddenInput}
                onChange={handleImageUpload}
              />
              }
            </label>
            <input type="text" value={message} onKeyDown={handleKeyDown} onChange={e=>handleMessage(e)}  className={`${styles.main__head_input} ${animateBorder ? styles.animate_border : ''}`} placeholder='Введите сообщение...'/>
            <img src={Send} onClick={handleSubmit} className={styles.main__head_send} alt="" />
          </div>
          :
          <>
          </>
        }
      </div>
    </div>
  )
}

export default Dialog