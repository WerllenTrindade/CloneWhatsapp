import React, {useState, useEffect} from 'react';
import '../components/ChatListItem.css'

// eslint-disable-next-line import/no-anonymous-default-export
export default ({click, active, data}) => {
    const [time, setTime] = useState('')
    
    // atualizar a data.
    useEffect(() => {
        if(data.lestMessageDate > 0){
          let date = new Date(data.lestMessageDate.seconds * 1000)
          let hours = date.getHours()
          let minutes = date.getMinutes();
          hours = hours < 10 ? '0'+hours : hours;
          minutes = minutes < 10 ? '0'+minutes : minutes;
          setTime(`${hours}:${minutes}`);
        }
     },[data])

     
  return (
    <div 
    className={`chatListItem ${active? 'active' : ''}`}
    onClick={click}>
      <img className="chatList-avatar" 
      src={data.image}
      alt="avatar" />
      <div className="chatList-lines">
        <div className="chatList-line">
          <div className="chatList-name">{data.title}</div>
          <div className="chatList-date">{time}</div>
        </div>
        <div className="chatList-line">
          <div className="chatList-lestMsg">
            <p>{data.lastMessage}</p>
          </div>
        </div>
      </div>
    </div>
  )
}