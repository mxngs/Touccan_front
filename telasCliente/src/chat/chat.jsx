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

const Chat = () => {
  const { chatId } = useParams(); // Esse chatId será o identificador único do chat
  const [novaMensagem, setNovaMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({ nome: '', foto: ''});
  const [isSameUser, setIsSameUser] = useState(false); // Verifica se o ID do usuário é o mesmo do cliente

  // Gerar um chatId único baseado nos IDs dos dois participantes
  const gerarChatId = (id_cliente, id_usuario) => {
    return `C${id_cliente}_U${id_usuario}`;
  };

  // O chatId que estamos usando agora é gerado com base nos IDs do cliente e do usuário
  const chatIdUnico = gerarChatId(id_cliente, chatId);

  // Carregar mensagens do Firebase para o chat específico
  useEffect(() => {
    const chatRef = ref(database, `chats/${chatIdUnico}/conversa`);
    const mensagensListener = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const mensagensArray = Object.values(data);

        // Filtra as mensagens para mostrar apenas as relevantes para o cliente logado
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

  // Buscar dados do usuário (verificando o id_usuario do chat)
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

          // Verifica se o id_cliente corresponde ao id do usuário para permitir a exibição das imagens
          setIsSameUser(usuarioData?.id === chatId); // Se os IDs forem iguais, renderiza as imagens
        } else {
          console.error('Erro ao buscar dados do usuário');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUsuario();
  }, [chatId]);

  // Enviar mensagem para o chat específico
  const enviarMensagem = () => {
    if (novaMensagem.trim() !== '') {
      const mensagem = {
        tipo: 'enviada',
        texto: novaMensagem,
        timestamp: new Date().toISOString(), // Timestamp para ordenação
        id_cliente: id_cliente, // ID do usuário que enviou a mensagem
      };

      // Salvar a mensagem no Firebase dentro de 'conversa'
      const chatRef = ref(database, `chats/${chatIdUnico}/conversa`);
      push(chatRef, mensagem)
        .then(() => {
          setNovaMensagem(''); // Limpar o campo de mensagem
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
              {/* Exibe a foto de perfil somente se os IDs forem iguais */}
              {isSameUser && (
                <img
                  className={msg.id_cliente === id_cliente ? 'foto-perfil-enviado' : 'foto-perfil-recebido'}
                  src={msg.id_cliente === id_cliente ? 'seu-perfil.png' : usuario.foto}
                  alt="Foto de Perfil"
                />
              )}
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
