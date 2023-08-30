import React, { useState, useEffect, useContext } from 'react';
import styles from './MessageList.module.css';
import Message from './components/Message';
import Logo from '../../assets/logo.png';
import { GET_DIALOG_BY_COMPANION_QUERY } from '../../query/queries.js';
import { ServiceContext } from './../../apolloClient.jsx';

const MessageList = (props) => {
  const { client } = useContext(ServiceContext);

  const [searchValue, setSearchValue] = useState('');
  const [dialogs, setDialogs] = useState(props.dialogs);
  const [search, setSearch] = useState('');

  useEffect(()=>{
    if(searchValue){
      client.query({
        query: GET_DIALOG_BY_COMPANION_QUERY,
        variables: {
            companion: +searchValue,
        },
        skip: !searchValue,
      }).then(response => {
        props.setToken(response.data.getDialogByCompanion);
      }).catch(error => {
        console.log(error);
      });
    }
    setDialogs(props.dialogs)
  },[props.dialogs, searchValue])

  const handleSelector = (i) => {
    props.setSelectedDialog(i);
    props.setToken(props.dialogs[i]);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);

  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchValue(search);
    }
  };

  return (
    <div>
      <img src={Logo} className={styles.logo} alt="" />
      <div className={styles.main}>
        <input type="search" value={search} onChange={handleSearch} onKeyDown={handleKeyDown} className={styles.main__search} placeholder='Поиск по id'/>
        <div className={styles.main__dialogs}>
          {dialogs ? dialogs.map((d, idx) => (
            props.lastMessages.map((d2,idx2)=>(
              d2.dialog===d.token?
                <div className={styles.main__dialogs_link} onClick={() => handleSelector(idx)} key={idx}>
                  {console.log(props.selectedDialog,'12313123123123')}
                  <Message lastMessages={d2} user={props.user} newMessage={props.newMessage} status={props.selectedDialog === idx ? 1 : 0} readStatus={props.readStatus?.filter((el)=>{return el.dialog===dialogs[idx]?.token})} info={dialogs[idx]} />
                  
                </div>
              :
              <></>
            ))
          )) : 
          <></>}
        </div>
      </div>
    </div>
  );
}

export default MessageList;
