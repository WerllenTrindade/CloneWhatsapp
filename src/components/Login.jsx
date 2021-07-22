import React from 'react'
import './Login.css'
import Api from '../Api'
import {GitPopUpGitLog} from '../Api'

// eslint-disable-next-line import/no-anonymous-default-export
export default ({onReceive}) => {

  // AUTENTICAÇÃO GIT 
  const handleGitLogin = async () => {
    let result = await GitPopUpGitLog();
    if(result){
      onReceive(result.user);
    }else{
      alert("Erro!")
    }
  }

  return(

    <div className="Login">
      <button 
      className="LoginGIt" 
      onClick={handleGitLogin}>
            Logar com gitHub
        </button>
    </div>
    
    
  )
}