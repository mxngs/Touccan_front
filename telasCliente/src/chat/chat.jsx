import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import './App.css';
import { initializeApp } from "firebase/app";

//funcionando

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm4r7cDuQWBT4dLTnNqj6ijVKvNVIJ-As",
  authDomain: "touccan-firebase.firebaseapp.com",
  databaseURL: "https://touccan-firebase-default-rtdb.firebaseio.com",
  projectId: "touccan-firebase",
  storageBucket: "touccan-firebase.firebasestorage.app",
  messagingSenderId: "906368056826",
  appId: "1:906368056826:web:0e8f0b08a2ae94acce3843",
  measurementId: "G-646HZZSX54"
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
  const chatConversaRef = useRef(null); // Referência para o container de mensagens

  // Carregar mensagens do Firebase para o chat específico
  useEffect(() => {
    const chatRef = ref(database, `chats/${chatIdUnico}/conversa`);
    const mensagensListener = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const mensagensArray = Object.values(data);
        // Inverter a ordem das mensagens para mostrar as mais recentes embaixo
        setMensagens(mensagensArray.reverse());
      }
      setLoading(false);
    });

    return () => {
      mensagensListener(); // Remover o listener ao sair da tela
    };
  }, [chatIdUnico]);

  useEffect(() => {
    if (chatConversaRef.current) {
      // Só rolar se a altura da conversa for maior que a altura do contêiner
      const { scrollHeight, clientHeight } = chatConversaRef.current;
      if (scrollHeight > clientHeight) {
        chatConversaRef.current.scrollTop = scrollHeight; // Rolagem até o final
      }
    }
  }, [mensagens]);

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

  // Enviar mensagem para o Firebase
  const enviarMensagem = () => {
    if (novaMensagem.trim() !== '') {
      const mensagem = {
        tipo: 'enviada',  // Tipo de mensagem enviada
        texto: novaMensagem,
        id_cliente: id_cliente  // ID do cliente (quem está enviando)
      };

      const chatRef = ref(database, `chats/${chatIdUnico}/conversa`);
      push(chatRef, mensagem)
        .then(() => {
          setNovaMensagem('');  // Limpar o campo de entrada
        })
        .catch((error) => console.error('Erro ao enviar mensagem:', error));
    }
  };

  // Rolagem automática para a última mensagem
  useEffect(() => {
    if (chatConversaRef.current) {
      chatConversaRef.current.scrollTop = chatConversaRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Função para tratar o envio com Enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      enviarMensagem();
    }
  };

  

  return (
    <div className="lado-direito">
      <div className="chat-header">
        <span className="nome-pessoa-chat">{usuario.nome}</span>
      </div>

      <div className="chat-conversa" ref={chatConversaRef}>
        {mensagens.length > 0 ? (
          mensagens.map((msg, index) => {
            const isCliente = msg.id_cliente === id_cliente;  // Mensagem do cliente
            const isUsuario = msg.id_usuario === chatId;  // Mensagem do usuário

            return (
              <div key={index} className={`msg-${isCliente ? 'cliente' : 'usuario'}`}>
                {/* Removido a exibição das imagens */}
                <div className="mensagem-texto">{msg.texto}</div>
              </div>
            );
          })
        ) : (
          <p>Sem mensagens ainda.</p>
        )}
      </div>

      <div className="input-mensagem">
        <div className="input-container">
          <input
            type="text"
            className="input-texto"
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyDown={handleKeyDown}  // Adicionando evento de tecla
          />
          <button className="btn-enviar-chat" onClick={enviarMensagem}>
            <img src="../img/enviar.png" alt="Enviar" className="btn-imagem" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
