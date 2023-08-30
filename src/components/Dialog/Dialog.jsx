import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './Dialog.module.css';
import CusDate from './components/Date';
import MessageSend from './components/MessageSend';
import MessageGet from './components/MessageGet';
import { SEND_MESSAGE_MUTATION, GET_MY_DIALOGS_QUERY, READ_MESSAGES_MUTATION, RECEIVE_MESSAGE_SUBSCRIPTION, CHANGE_COMPANION_STATE, COMPANION_CONDITION_SUBSCRIPTION, SEND_IMAGE_MUTATION } from '../../query/queries.js';
import { format } from 'date-fns';
import { ServiceContext } from './../../apolloClient.jsx';

import Add from '../../assets/Add.png'
import Send from '../../assets/Send.png';

const Dialog = (props) => {
  const { client, webSocketClient } = useContext(ServiceContext);

  const dialogComp = props.dialog?.companion?.id;


  const [message, setMessage] = useState('');
  const [animateBorder, setAnimateBorder] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Новое состояние
  const [rotateAddImage, setRotateAddImage] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [showMessages, setShowMessages] = useState(true);
  const [localMess, setLocalMess] = useState([]);
  const messagesContainerRef = useRef();

  const [newMessage, setNewMessage] = useState([]);

  const [focus, setFocus] = useState(false);

  const [isType, setIsType] = useState({
    state:false,
    companion: null,
  });

  let currentDate = '';
  let stepDate = '';

  const handleInputFocus = () => {
    setFocus(true);
    console.log('Input is now active.');
    client.mutate({
      mutation: CHANGE_COMPANION_STATE,
      variables: {
          input: {
            state: 'START_TYPING',
            targetId: props.dialog.companion.id
        },
      },
    }).then(response => {
      console.log('Mutation response:', response.data, props);
    }).catch(error => {
      console.error('Mutation error:', error);
    });
  }

  const handleInputBlur = () => {
    setFocus(false);
    console.log('Input lost focus.');
    client.mutate({
      mutation: CHANGE_COMPANION_STATE,
      variables: {
          input: {
            state: 'END_TYPING',
            targetId: props.dialog.companion.id
        },
      },
    }).then(response => {
      console.log('Mutation response:', response.data);
    }).catch(error => {
      console.error('Mutation error:', error);
    });
}



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
      query: COMPANION_CONDITION_SUBSCRIPTION,
    }).subscribe({
      next(res){
        console.log('COMPANION_CONDITION_SUBSCRIPTION Response: ', res.data.companionCondition, dialogComp)
        if (props.dialog.companion.id===res.data.companionCondition.companion){
          if(res.data.companionCondition.state==='START_TYPING'){
            setIsType({
              type: true,
              companion: props.dialog.companion.id,
            })
            
          } else if (res.data.companionCondition.state==='END_TYPING'){
            setIsType({
              type: false,
              companion: null,
            })
          }
        }
      },
      error(error){
        console.error('RECEIVE_MESSAGE_SUBSCRIPTION Error: ', error)
      }
    });

    return () => {
      
      subscription.unsubscribe();
    }
  }, [props])



  useEffect(()=>{
    const subscription = webSocketClient.subscribe({
      query: RECEIVE_MESSAGE_SUBSCRIPTION,
    }).subscribe({
      next(res){
        let RD = false
        if(props.dialog.companion.id===res.data.receiveMessage.ownerId){
          client.mutate({
            mutation: READ_MESSAGES_MUTATION,
            variables: {
              messagesId: res.data.receiveMessage.id,
              dialog: props?.dialog?.token,
            },
          }).then(response => {
            RD=true;
            console.log('Mutation response:', response);
          }).catch(error => {
            console.error('Mutation error:', error, nonReadedMessagesId, selectedDialogToken?.token);
          });
        }
        
        // Копируем массив lastMessages
        const updatedLastMessages = [...props.lastMessages];

        // Находим индекс объекта, который нужно обновить
        const indexToUpdate = updatedLastMessages.findIndex(message => message.dialog === res.data.receiveMessage.dialog);

        if (indexToUpdate !== -1) {
          // Обновляем нужный объект
          updatedLastMessages[indexToUpdate] = {
            ...updatedLastMessages[indexToUpdate],
            lastMessage: res.data.receiveMessage.message, // Обновляем текст последнего сообщения, например
            isRead: RD,
            createdAt: res.data.receiveMessage.createdAt,
            ownerId: res.data.receiveMessage.ownerId,
          };

        }
        console.log(updatedLastMessages)
        props.setLastMessages(updatedLastMessages);
        console.log(props.lastMessages)
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
  }, [props])

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
            const updatedLastMessages = [...props.lastMessages];
            const indexToUpdate = updatedLastMessages.findIndex(message => message.dialog === props.dialog.token);
            if (indexToUpdate !== -1) {
              updatedLastMessages[indexToUpdate] = {
                ...updatedLastMessages[indexToUpdate],
                lastMessage: response.data.sendMessage.message, // Обновляем текст последнего сообщения, например
                isRead: response.data.sendMessage.isRead,
                createdAt: response.data.sendMessage.createdAt,
                ownerId: response.data.sendMessage.ownerId,
              };
            }
            console.log(updatedLastMessages)
            props.setLastMessages(updatedLastMessages);

            const updatedMessages = [...newMessage, response.data.sendMessage];
            setNewMessage(updatedMessages);
            console.log('Mutation response:', response.data.sendMessage);
          }).catch(error => {
            console.error('Mutation error:', error, nonReadedMessagesId, selectedDialogToken?.token);
          });
        }
        if(selectedImage instanceof File){
          const files = new FormData;
          files.append('file',selectedImage);
          client.mutate({
            mutation: SEND_IMAGE_MUTATION,
            variables: {
                input: {
                  file: files,
                  companion: props.dialog.companion.id,
                  dialogToken: props.dialog.token,
                },
            },
            context: {
              clientName: 'storage'
            }
          }).then(response => {
            // const updatedMessages = [...newMessage, response.data.sendMessage];
            // setNewMessage(updatedMessages);
            console.log('Mutation response:', response.data);
          }).catch(error => {
            console.error('Mutation error:', error);
          });}

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
          ownerId: props.user.id
        });
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

  const handleNothing = () => {};

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
              if(el.ownerId===props.user.id){
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
              if(el.ownerId===props.user.id){
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
      {
          isType.type && isType.companion===props.dialog.companion.id?
          <div className={styles.type}>
            <h6 className={styles.type_h}>
              {props.dialog.companion.firstname+' печатает...'}
            </h6>
          </div>
          :
          <div className={styles.type}>
          
          </div>
        }

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
            <input type="text" onFocus={handleInputFocus} onBlur={handleInputBlur} value={message} onKeyDown={handleKeyDown} onChange={e=>handleMessage(e)}  className={`${styles.main__head_input} ${animateBorder ? styles.animate_border : ''}`} placeholder='Введите сообщение...'/>
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