import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { useParams, Link } from 'react-router-dom';
import './App.css';
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBslNgrhtDObgNFm3-CIeBp96WlI9GklL4",
  authDomain: "touccan-chat.firebaseapp.com",
  databaseURL: "https://touccan-chat-default-rtdb.firebaseio.com",
  projectId: "touccan-chat",
  storageBucket: "touccan-chat.firebasestorage.app",
  messagingSenderId: "647816113687",
  appId: "1:647816113687:web:1c28374f44bd236d26f652"
};
const id_cliente = localStorage.getItem('id_cliente'); // ID do cliente logado

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Chat = ({ chatId }) => {
  const [novaMensagem, setNovaMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({ nome: '', foto: '' });
  const [isSameUser, setIsSameUser] = useState(false);

  const chatIdUnico = `C${id_cliente}_U${chatId}`;

  // Carregar mensagens do Firebase para o chat específico
  useEffect(() => {
    const chatRef = ref(database, `chats/${chatIdUnico}/conversa`);
    const mensagensListener = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const mensagensArray = Object.values(data);
        const mensagensFiltradas = mensagensArray.filter(msg =>
          msg.id_cliente === id_cliente || msg.id_usuario === chatId
        );
        setMensagens(mensagensFiltradas);
      }
      setLoading(false);
    });

    return () => {
      mensagensListener(); // Remover o listener ao sair da tela
    };
  }, [chatIdUnico, id_cliente, chatId]);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/usuario/${chatId}`);
        const data = await response.json();
        if (data && data.status_code === 200) {
          const usuarioData = data.usuario;
          setUsuario({
            nome: usuarioData?.nome || 'Usuário Desconhecido',
            foto: usuarioData?.foto || '../../img/person.png',
          });
          setIsSameUser(usuarioData?.id === chatId);
        } else {
          console.error('Erro ao buscar dados do usuário');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUsuario();
  }, [chatId]);

  const enviarMensagem = () => {
    if (novaMensagem.trim() !== '') {
      const mensagem = {
        tipo: 'enviada',
        texto: novaMensagem,
        timestamp: new Date().toISOString(),
        id_cliente: id_cliente,
      };

      const chatRef = ref(database, `chats/${chatIdUnico}/conversa`);
      push(chatRef, mensagem)
        .then(() => {
          setNovaMensagem('');
        })
        .catch((error) => console.error('Erro ao enviar mensagem:', error));
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="lado-direito">
      <div className="chat-header">
        <img src={usuario.foto} alt="Foto do usuário" className="foto-perfil-enviado" />
        <span className="nome-pessoa-chat">{usuario.nome}</span>
      </div>

      <div className="chat-conversa">
        {mensagens.length > 0 ? (
          mensagens.map((msg, index) => (
            <div key={index} className={`msg-${msg.tipo}`}>
              <div className="foto-perfil-enviado"></div>
              <div className="mensagem-texto">{msg.texto}</div>
            </div>
          ))
        ) : (
          <p>Sem mensagens ainda.</p>
        )}
      </div>

      <div className="input-mensagem">
        <input
          type="text"
          className="input-texto"
          placeholder="Digite sua mensagem..."
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
        />
        <button className="btn-enviar-chat" onClick={enviarMensagem}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
