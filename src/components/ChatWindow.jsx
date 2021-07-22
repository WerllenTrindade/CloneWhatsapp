/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from 'react'
import EmojiPicker from 'emoji-picker-react'
import './ChatWindow.css'

import MessageItem from './MessageItem'
import {onChatContent, sendMessage} from '../Api'

import SearchIcon from '@material-ui/icons/Search'; // busca
import AttachFileIcon from '@material-ui/icons/AttachFile'; //anexo
import MoreVertIcon from '@material-ui/icons/MoreVert'; // 3 pontos
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';//emoji
import CloseIcon from '@material-ui/icons/Close';// X
import SendIcon from '@material-ui/icons/Send'; // envio
import MicIcon from '@material-ui/icons/Mic'; // microfone

// eslint-disable-next-line import/no-anonymous-default-export
export default ({user, data}) => {

  const body = useRef(); // mutar o scroll da conversa do zapp

  let recognition = null
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(SpeechRecognition !== undefined) {
    recognition = new SpeechRecognition()
  }

  const [emojiOpen,setEmojiOpen] = useState(false)
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false);
  const [list, setList] = useState([])
  const [users, setUsers] = useState([])

  // jogar as messagem na lista 
  useEffect(() => {
    setList([]);
    let unSub = onChatContent(data.chatId, setList, setUsers);
    return unSub;
  },[data.chatId])


  useEffect(() => {
    if(body.current.scrollHeight > body.current.offsetHeight){ // a altura do body atual é maior que a inicial ?
      body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight
    } // JOGAR O SCROLL DA CV DO ZAPP PARA BAIXO !!!
    },[list])

  const handleEmojiClick = (evento, emojiObject) => {
    setText(text + emojiObject.emoji)
  }

  const handleOpenEmoji = () => {
    setEmojiOpen(true)
  }
  const handleCloseEmoji = () => {
    setEmojiOpen(false)
  }

  const handleMicClick = () => {
    if(recognition !== null){

      recognition.onstart = () => {
          setListening(true);
      }
      recognition.onend = () => {
        setListening(false)
      }
      recognition.onresult = e => {
       setText(e.results[0][0].transcript);
      }
       recognition.start();
    }
  }

  const handleInputKeyUp = (enter) =>{
    if(enter.keyCode == 13){
      handleSendClick()
    }
  }

  const handleSendClick = () => {
    if(text !== ''){
      sendMessage(data, user.id, 'text', text, users);
      setText('');
      setEmojiOpen(false);
    }
  }
  return(
      <div className="chatWindow">
        <div className="chatWindow-header">
          <div className="chatWindow-headerInfo">
            <img className="chatWindow-avatar"
            src={data.image}
            alt="avatar" />
            <div className="chatWindow-name">{data.title}</div>
          </div>
        
          <div className="chatWindow-headerButtons">
              <div className="chatWindow-btn">
                <SearchIcon style={{color: '#919191'}} />
              </div>
              <div className="chatWindow-btn">
                <AttachFileIcon style={{color: '#919191'}} />
              </div>
              <div className="chatWindow-btn">
                <MoreVertIcon style={{color: '#919191'}} />
              </div>
          </div>
        </div>

        <div ref={body} className="chatWindow-body">
          {list.map((item, key) => (
            <MessageItem
            key={key}
            data={item}
            user={user}
            />
          ))}
        </div>

        <div className="chatWindow-emojiArea" 
        style={{height: emojiOpen ? '200px' : '0px'}}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            disableSearchBar /*desabilita o campo de busca dos emoji*/
            disableSkinTonePicker // desabilitar cor de pele dos emoji
          />
        </div>

        <div className="chatWindow-footer">
          
          <div className="chatWindow-pre">

              <div
              onClick={handleCloseEmoji}
              className="chatWindow-btn"
              style={{width: emojiOpen?40:0}}>
                <CloseIcon style={{color: '#919191'}} />
              </div>

              <div 
              onClick={handleOpenEmoji}
              className="chatWindow-btn">
                <InsertEmoticonIcon style={{color: emojiOpen ? '#009688' :'#919191'  }} />
              </div>
          </div>

          <div className="chatWindow-inputArea">
            <input className="chatWindow-input"
             type="text" 
             name="InputText"
             placeholder="Digite uma mensagem" 
             value={text}
             onChange={e => setText(e.target.value)}
            onKeyUp= {handleInputKeyUp}
             />
          </div>

          <div className="chatWindow-pos">
            {text === '' && 
            <div 
            className="chatWindow-btn"
            onClick={handleMicClick}>
                <MicIcon style={{color:  listening ? '#126ECE' : '#919191'}} />
              </div>}
              
              {text !== '' && 
              <div 
              onClick={handleSendClick}
              className="chatWindow-btn">
                <SendIcon style={{color: '#919191'}} />
              </div>
              }
              
          </div>
        </div>
      </div>
  )
}