import React, { useState } from 'react'
import styles from './MessageList.module.css';
import Message from './components/Message';
import Logo from '../../assets/logo.png';
const MessageList = () => {
  const [selectedDialog, setSelectedDialog] = useState(null)
  const [dialogs, setDialogs] = useState([
    {
      name: 'Andrew',
    },
    {
      name: 'Alex',
    },
    {
      name: 'Stephan',
    },
    {
      name: 'Stephan',
    },
    {
      name: 'Stephan',
    },
    {
      name: 'Stephan',
    },

  ]);

  const handleSelector = (i) => {
    setSelectedDialog(i)
    console.log(i, selectedDialog)
  }
  
  return (
    <div>
    <img src={Logo} className={styles.logo} alt="" />
    <div className={styles.main}>
        <input type="search" className={styles.main__search} placeholder='Поиск по сообщениям'/>
        <div className={styles.main__dialogs}>
          {
            dialogs?
            dialogs.map(function(d, idx){
              return (
                <div className={styles.main__dialogs_link} onClick={()=>{handleSelector(idx)}}>
                  <Message status={
                    selectedDialog===idx?
                    1
                    :
                    0
                  } key={idx}/>
                </div>
              )
            })
            :
            <></>
          }
        </div>
    </div>
  </div>
  )
}

export default MessageList