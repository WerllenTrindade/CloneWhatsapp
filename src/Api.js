/* eslint-disable no-undef */
import firebase from "firebase/app";
import "firebase/firebase-auth"; // Import Obrigatório
import "firebase/firebase-firestore"; // Import Obrigatório
import firebaseConfig from "./firebaseConfig"; // Import pasta do firebase

// criar uma constante e fazer ela receber a
// Importação do " firebase - 1Linha"
// Iniciando com " initializeApp direto do firebase"
// Passando o nome da pasta que esta os dados para auth "

const firebaseApp = firebase.initializeApp(firebaseConfig);

// Sempre que for manipular os dados do fire base
// conexão com banco de dados
// eslint-disable-next-line no-unused-vars
const db = firebaseApp.firestore();

//tradutor:
// Provider = fornecedor
// pop up = aparecer

//Processo de Login com GitHub
export const GitPopUpGitLog = async () => {
  const provider = new firebase.auth.GithubAuthProvider();
  let result = await firebaseApp.auth().signInWithPopup(provider);
  return result;
};

// Criar um usuário em base da autenticação do gitHub no fire base
export const AddUser = async (dados) => {
  await db.collection("users").doc(dados.id).set(
    {
      name: dados.name,
      avatar: dados.avatar,
    },
    { merge: true }
  );
};

// retornar uma lista.
export const getContatacList = async (userId) =>{
    let list = [];
      let results = await db.collection('users').get();
      results.forEach(result => {
        let data = result.data();

        if(result.id !== userId){
          list.push({
            id: result.id,
            name: data.name,
            avatar: data.avatar
          })
        }
      })

    return list;
}

// criar interação entre duas conversas 
export const addNewChats = async (user,user2) => {
  // responsável por criar a conversa
  let newChat = await db.collection('chats').add({
    messages:[],
    users:[user.id, user2.id]
  });

  // responsável por criar a conversa entra o usuário 1
  db.collection('users').doc(user.id).update({
    chats:firebase.firestore.FieldValue.arrayUnion({
      chatId: newChat.id,
      title: user2.name,
      image:user2.avatar,
      with:user2.id
    })
  })

  // responsável por criar a conversa entra o usuário 2
  db.collection('users').doc(user2.id).update({
    chats:firebase.firestore.FieldValue.arrayUnion({
      chatId: newChat.id,
      title: user.name,
      image:user.avatar,
      with:user.id
    })
  })
}

// Método onSnapshot - collection - doc do firebase
// https://firebase.google.com/docs/firestore/query-data/listen?hl=pt-br
//db.collection serve para monitorar direto do firebase todo os chats

export const onChatList = (userId, setCHatList) => {
  return db.collection('users').doc(userId).onSnapshot((doc) => {
    if(doc.exists){
      let data = doc.data();
        if(data.chats){
          let chats = [...data.chats];

          chats.sort((a,b) => {
              if(a.lestMessageDate && b.lestMessageDate === undefined){
                return -1;
              }
              if(a.lestMessageDate.seconds < b.lestMessageDate.seconds){
                return 1;
              }else{
                return -1
              }
              
          });
          setCHatList(chats);
        }
    }
  })
} 

export const onChatContent = (chatId, setList, setUsers) => {
  return db.collection('chats').doc(chatId).onSnapshot((doc) => {
    if(doc.exists){
      let data= doc.data();
      setList(data.messages)
      setUsers(data.users);
    }
  })
}

export const sendMessage = async (chatData, userId, type, body, users) => {
  let nowDate = new Date();

  // inserir nova messages
  db.collection('chats').doc(chatData.chatId).update({
    messages: firebase.firestore.FieldValue.arrayUnion({
      type,
      author: userId,
      body,
      date: nowDate
    })
  })

  for(let i in users){
    let u = await db.collection('users').doc(users[i]).get()
    let uData = u.data();
    if(uData.chats){
      let chats = [...uData.chats];

      for(let e in chats){
        if(chats[e].chatId == chatData.chatId){
          chats[e].lastMessage = body;
          chats[e].lestMessageDate = nowDate;
        }
      }
      await db.collection('users').doc(users[i]).update({
        chats:chats
      })
    }
  }
}