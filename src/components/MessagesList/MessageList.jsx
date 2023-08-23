import React, { useState, useEffect } from 'react';
import styles from './MessageList.module.css';
import Message from './components/Message';
import Logo from '../../assets/logo.png';
import { GET_DIALOG_BY_COMPANION_QUERY } from '../../query/queries.js';
import { useQuery } from "@apollo/client";

const MessageList = (props) => {
  const [selectedDialog, setSelectedDialog] = useState(null);
  const [dialogs, setDialogs] = useState(props.dialogs);
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const { loading: loadingSearch, error: errorSearch, data: dataSearch } = useQuery(GET_DIALOG_BY_COMPANION_QUERY, {
    variables: {
      companion: +searchValue,
    },
    context: {
      clientName: 'default'
    },
    skip: !searchValue,
  });

  useEffect(() => {
    if (!loadingSearch && !errorSearch && dataSearch !== undefined) {
      console.log(dataSearch);

      props.setToken(dataSearch.getDialogByCompanion);
      
    }
    console.log(loadingSearch, errorSearch)
  }, [loadingSearch, errorSearch, dataSearch, searchValue]);

  const handleSelector = (i) => {
    setSelectedDialog(i);
    props.setToken(props.dialogs[i]);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log(search)
      setSearchValue(search); // Устанавливаем значение для запроса
    }
  };

  return (
    <div>
      <img src={Logo} className={styles.logo} alt="" />
      <div className={styles.main}>
        <input type="search" value={search} onChange={handleSearch} onKeyDown={handleKeyDown} className={styles.main__search} placeholder='Поиск по id'/>
        <div className={styles.main__dialogs}>
          {dialogs ? dialogs.map((d, idx) => (
            <div className={styles.main__dialogs_link} onClick={() => handleSelector(idx)} key={idx}>
              <Message user={props.user} newMessage={props.newMessage} status={selectedDialog === idx ? 1 : 0} info={dialogs[idx]} />
            </div>
          )) : <></>}
        </div>
      </div>
    </div>
  );
}

export default MessageList;
