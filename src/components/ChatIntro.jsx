import React from 'react'
import './ChatIntro.css'

import imgWpp from '../image/img-whtsap.png'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return(
    <div className="chatIntro">
      <img src={imgWpp} alt="" />
      <h1>Matenha seu celular<br/> conectado</h1>
      <h2>O WhatsApp conecta ao seu telefone para sincronizar suas mensagens para <br/>
      reduzir o uso de dados, conecte seu telefone a uma rede Wi-Fi.</h2>
    </div>
  )
}