import React, { useState, useEffect } from 'react'
import './newChat.css'

import {getContatacList} from '../Api'
import {addNewChats} from '../Api'

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({user, chatList, show, setShow}) => {
  const [list, setList] = useState([ ]);

  useEffect(() => {
    const getList = async () => {
        if(user !== null){
          let results = await getContatacList(user.id);
          setList(results)
        }
    }
    getList();
  },[user])

  const handleClose = () => {
    setShow(false);
  }

  const addNewChat = async (user2) => {
      await addNewChats(user, user2);

      handleClose();
  }

  return(
    <div className="newChat" style={{left: show ? 0 : -415}}>
        <div className="newChat-header">
              <div onClick={handleClose} className="newChat-backButton">
                    <ArrowBackIcon style={{ color: '#FFF' }}/>
              </div>
              <div className="newChat-headTitle" style={{ color: '#FFF' }}>
                  Nova Conversa
                </div>
        </div>
        <div className="newChat-list">
                {list.map((item, key) => (
                  <div 
                  onClick={() =>addNewChat(item)}
                  className="newChat-item" key={key}>
                    <img className="newChat-itemAvatar" src={item.avatar} alt="" />
                    <div className="newChat-itemName">{item.name}</div>
                  </div>
                ))}
        </div>
    </div>
  )
}