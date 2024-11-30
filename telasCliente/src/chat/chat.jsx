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
const id_cliente = localStorage.getItem('id_cliente');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Chat = () => {
  const { chatId } = useParams();
  const [novaMensagem, setNovaMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({ nome: '', foto: '', id: '' });

  // Função para carregar as mensagens do Firebase
  useEffect(() => {
    const [id_usuario_1, id_usuario_2] = chatId.split('_');
    if (id_usuario_1 !== id_cliente && id_usuario_2 !== id_cliente) {
      // Verifica se o chat não pertence ao cliente logado
      console.error('Você não tem acesso a este chat');
      return;
    }

    const chatRef = ref(database, `chats/${chatId}`);
    const mensagensListener = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const mensagensArray = Object.values(data);
        setMensagens(mensagensArray);
      }
      setLoading(false);
    });

    return () => {
      mensagensListener(); // Remove listener ao sair da tela
    };
  }, [chatId]);

  // Função para buscar os dados do usuário
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/usuario/${chatId}`);
        const data = await response.json();
        if (data && data.status_code === 200) {
          setUsuario({
            nome: data.usuario?.nome || 'Usuário Desconhecido',
            foto: data.usuario?.foto || '../../img/person.png',
            id: data.usuario?.id || ''
          });
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
        id_cliente: id_cliente, // Adicionando o ID do usuário que enviou a mensagem
      };

      // Monta o caminho do chat com os IDs dos dois usuários
      const [id_usuario_1, id_usuario_2] = chatId.split('_');
      const chatRef = ref(database, `chats/${chatId}/conversa_unica_${Date.now()}`);
      
      // Salvar a mensagem no Firebase
      push(chatRef, mensagem)
        .then(() => {
          setNovaMensagem(''); // Limpa o campo de mensagem
        })
        .catch((error) => console.error('Erro ao enviar mensagem:', error));
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="lado-direito">
      <div className="chat">
        <div className="chat-header">
          <Link to="/home" className="btn-voltar-chat"></Link>
          <div className="nome-pessoa-chat">{usuario.nome}</div>
          <div className="linha-laranja"></div>
        </div>

        <div className="chat-conversa">
          {mensagens.map((msg, index) => (
            <div key={index} className={msg.id_cliente === id_cliente ? 'msg-enviada' : 'msg-recebida'}>
              <img
                className={msg.id_cliente === id_cliente ? 'foto-perfil-enviado' : 'foto-perfil-recebido'}
                src={msg.id_cliente === id_cliente ? 'seu-perfil.png' : usuario.foto}
                alt="Foto de Perfil"
              />
              <div className="mensagem-texto">{msg.texto}</div>
            </div>
          ))}
        </div>

        <div className="input-mensagem">
          <input
            type="text"
            className="input-texto"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Digite sua mensagem"
          />
          <button className="btn-enviar-chat" onClick={enviarMensagem}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
