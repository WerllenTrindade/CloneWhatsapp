import React, { useEffect, useState } from 'react';
import './App.css';
import ChatListItem from './components/ChatListItem'
import ChatIntro from './components/ChatIntro'
import ChatWindow from './components/ChatWindow'
import NewChat from './components/newChat'
import Login from './components/Login'

import {AddUser} from './Api'
import {onChatList} from './Api'

import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [chatList, setChatList] = useState([])
  const [activeChat, setActiveChat] = useState({}); // ver se tem chat ativo. !
  const [showNewChat, setShowNewChat] = useState(false)
  const [user, setUser] = useState(null)

    useEffect(() => {
      if(user !== null){
        let unSub = onChatList(user.id, setChatList);
        return unSub;
      }
    },[user]);


  // para nova aba de conversa.
  const handleNewChat = () => {
    setShowNewChat(true)
  }

  // Quando terminar processo de login
  // voltar com as seguintes informações
        // uid é direto de facebook...
  const handleLoginData = async info => {
    let newUser = {
      id: info.uid,
      name: info.displayName,
      avatar: info.photoURL
    };
    await AddUser(newUser)
    setUser(newUser);
  }

  // efetuar login
  if(user === null){
    return(<Login onReceive={handleLoginData} />);
  }

  return(
    <div className="app-window">
      <div className="sidebar">
        <NewChat
        chatList={chatList}
        user={user}
        show={showNewChat}
        setShow={setShowNewChat}
        />
          <header>
            <img 
            src={user.avatar}
            alt="Avatar"
            className="header-avatar"/>
            <div className="header-buttons">
              <div className="header-btn">
              <DonutLargeIcon style={{color: '#919191'}}/>
              </div>

              <div 
              onClick={handleNewChat}
              className="header-btn">
              <ChatIcon style={{color: '#919191'}}/>
              </div>

              <div className="header-btn">
              <MoreVertIcon style={{color: '#919191'}}/>
              </div>
            </div>
          </header>
        <div className="search">
        <div className="search-input">
          <SearchIcon style={{color: '#919191'}} fontSize="small"/>
          <input type="search" 
          placeholder="Procurar ou começar uma nova conversa" 
          id="" />
        </div>
        </div>

        <div className="chatList">
        {chatList.map((item,key) => (
              <ChatListItem
              key={key}
              data={item}
              // saber qual chat esta ativado
              active={activeChat.chatId === chatList[key].chatId} //props
              click={() => setActiveChat(chatList[key])}//props
              />
          ))}
        </div>


      </div>
      <div className="content-area">
        {activeChat.chatId !== undefined &&
        <ChatWindow
        user={user}
        data={activeChat}
        />
        }
        {
        activeChat.chatId === undefined  && 
        <ChatIntro/>
        }
      </div>
    </div>
  )
}