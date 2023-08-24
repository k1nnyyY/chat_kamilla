import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './Dialog.module.css';
import CusDate from './components/Date';
import MessageSend from './components/MessageSend';
import MessageGet from './components/MessageGet';
import { SEND_MESSAGE_MUTATION, GET_MY_DIALOGS_QUERY, RECEIVE_MESSAGE_SUBSCRIPTION } from '../../query/queries.js';
import { format } from 'date-fns';
import { ServiceContext } from './../../apolloClient.jsx';

import Add from '../../assets/Add.png'
import Send from '../../assets/Send.png';

const Dialog = (props) => {
  const { client, webSocketClient } = useContext(ServiceContext);

  const [message, setMessage] = useState('');
  const [animateBorder, setAnimateBorder] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Новое состояние
  const [rotateAddImage, setRotateAddImage] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [showMessages, setShowMessages] = useState(true);
  const [localMess, setLocalMess] = useState([]);
  const messagesContainerRef = useRef();

  const [newMessage, setNewMessage] = useState([]);

  let currentDate = '';
  let stepDate = '';

  useEffect(() => {
    if (props.dialog === null) {
      setShowMessages(false);
    } else {
      setShowMessages(true);
    }
    console.log(props.dialog, showMessages, reversedMessages)
  }, [props.dialog]);

  useEffect(()=>{
    const subscription = webSocketClient.subscribe({
      query: RECEIVE_MESSAGE_SUBSCRIPTION,
    }).subscribe({
      next(res){
        // const updatedMessages = [...newMessage, res.data.receiveMessage];
        setNewMessage(prevMessages => [...prevMessages, res.data.receiveMessage]);
        console.log('RECEIVE_MESSAGE_SUBSCRIPTION Response: ', res.data.receiveMessage)
      },
      error(error){
        console.error('RECEIVE_MESSAGE_SUBSCRIPTION Error: ', error)
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, [])

  useEffect(()=>{
    client.query({
      query: GET_MY_DIALOGS_QUERY,
    }).then(response => {
      console.log('NEW',response.data.getMyDialogs[0]);
      props.setDialogs(response.data.getMyDialogs);
    }).catch(error => {
      console.log(error);
    });
  }, [newMessage.length])


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
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (message.trim() === '' && selectedImage===null) {
      if(animateBorder){
        return
      };
      setAnimateBorder(true);
      setTimeout(() => {setAnimateBorder(false)}, 1000);
    } else {
      console.log(props.dialog)
      try {
        if(message.trim() !== ''){
          client.mutate({
            mutation: SEND_MESSAGE_MUTATION,
            variables: {
                input: {
                  message: message,
                  companion: props.dialog.companion.id,
                  dialogToken: props.dialog.token,
                },
            },
          }).then(response => {
            const updatedMessages = [...newMessage, response.data.sendMessage];
            setNewMessage(updatedMessages);
            console.log('Mutation response:', response.data.sendMessage);
          }).catch(error => {
            console.error('Mutation error:', error, nonReadedMessagesId, selectedDialogToken?.token);
          });
      // }
      //   if(selectedImage instanceof File){
      //     const response = await sendImageMutation({
      //       variables: {
      //         input: {
      //           file: selectedImage,
      //         }
      //       },
      //       context: {
      //         clientName: 'storage'
      //       }
      //     })
      //     console.log('Image sent:', response.data.sendMessage);
        }
        setSelectedImage(null)
        setRotateAddImage(false);
        setSelectedImagePreview(null)
        setMessage('');
  
        const date = Date.now();   
        const formattedTime = format(date, 'HH:mm');
        // localMess.push({
        //   message: message,
        //   createdAt: formattedTime,
        //   image: null,
        //   type: 'send',
        //   token: props.dialog.token,
        //   ownerId: props.user.id
        // });
        props.newMessage.push({
          message: message,
          createdAt: formattedTime,
          image: null,
          type: 'send',
          token: props.dialog.token,
          ownerId: props.user.id
        });
        console.log('LocalMess: ',localMess)
      } catch (error) {
        console.error('Dialog.jsx error sending message:', error);
      }
      setSelectedImage(null)
      setRotateAddImage(false);
      setSelectedImagePreview(null)
      setMessage('');
    }
  };

  let reversedMessages = props.messages.getMessages ? props.messages.getMessages.slice().sort((a, b) => {return new Date(a.createdAt) - new Date(b.createdAt)}): null;

  
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [reversedMessages]);

  const handleNothing = () => {

  };

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
              Диалог не выбран.
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
                      <CusDate key={i*200+12333} date={el.createdAt}/>
                      <MessageSend  element={el} key={i*300+1239} image={el.image} text={el.message} time={formattedTime}/>
                    </>
                    :
                    <>
                      <MessageSend element={el} key={i+1} image={el.image} text={el.message} time={formattedTime}/>
                    </>
                  
                )
              }
              return(
                formattedDate!==currentDate?
                <>
                  <CusDate key={i*100+56} date={el.createdAt}/>
                  <MessageGet key={i*800} image={el.image} text={el.message} time={formattedTime}/>
                </>
                :
                <>
                  <MessageGet key={i*600+63} image={el.image} text={el.message} time={formattedTime}/>
                </>
              )
            })
          }
            {
              localMess ?
              <>
                {
                  localMess?.map((el,i)=>{
                    if(el.token===props.dialog.token && el.ownerId===props.user.id){
                      return (
                        <MessageSend key={i*1000+189} element={el} image={el.image} text={el.message} time={el.createdAt}/>
                        )
                    } else if (el.ownerId===props.dialog.companion.id) {
                      return (
                        <></>
                      )
                    }
                  })
                }
              </>
              :
              <>
              </>
            }
            { // ! ------------------------

            newMessage?.map(function(el,i){
              if((el.message===null && el.image===null) || el.dialog!==props.dialog.token){
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
                      <CusDate key={i*200+12333} date={el.createdAt}/>
                      <MessageSend  element={el} key={i*300+1239} image={el.image} text={el.message} time={formattedTime}/>
                    </>
                    :
                    <>
                      <MessageSend element={el} key={i+1} image={el.image} text={el.message} time={formattedTime}/>
                    </>
                  
                )
              }
              return(
                formattedDate!==currentDate?
                <>
                  <CusDate key={i*100+56} date={el.createdAt}/>
                  <MessageGet key={i*800} image={el.image} text={el.message} time={formattedTime}/>
                </>
                :
                <>
                  <MessageGet key={i*600+63} image={el.image} text={el.message} time={formattedTime}/>
                </>
              )
            })
            // ! --------------------------
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
              <img src={Add} onClick={selectedImage?handleClearFiles:handleNothing} className={`${styles.main__head_add} ${selectedImage ? styles.selectedImage : ''}`} alt="Add Image" />
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