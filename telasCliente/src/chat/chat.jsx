import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './App.css';

const Chat = ({ conversas = {}, atualizarConversas }) => {
  const { chatId } = useParams();
  const [novaMensagem, setNovaMensagem] = useState('');

  // Dados fictícios caso o chatId não exista
  const conversaPadrao = [
    { tipo: 'recebida', texto: 'Olá! Tudo bem?', nome: 'Contato Exemplo' },
    { tipo: 'recebida', texto: 'Eu sou apenas uma conversa simulada.', nome: 'Contato Exemplo' },
  ];

  // Pega a conversa atual ou usa a conversa padrão
  const mensagens = conversas[chatId] || conversaPadrao;

  // Nome do contato (usado no cabeçalho)
  const nomeContato = mensagens[0]?.nome || 'Contato Desconhecido';

  const enviarMensagem = () => {
    if (novaMensagem.trim() !== '') {
      const mensagem = { tipo: 'enviada', texto: novaMensagem };
      if (atualizarConversas) {
        atualizarConversas(chatId, mensagem);
      } else {
        console.log('Mensagem enviada (simulada):', mensagem);
      }
      setNovaMensagem('');
    }
  };

  return (
    <div className="lado-direito">
      <div className="chat">
        <div className="chat-header">
          <Link to="/" className="btn-voltar-chat">&#8592; Voltar</Link>
          <div className="nome-pessoa-chat">{nomeContato}</div>
          <div className="linha-laranja"></div>
        </div>

        <div className="chat-conversa">
          {mensagens.map((msg, index) => (
            <div key={index} className={msg.tipo === 'enviada' ? 'msg-enviada' : 'msg-recebida'}>
              <img
                className={msg.tipo === 'enviada' ? 'foto-perfil-enviado' : 'foto-perfil-recebido'}
                src={msg.tipo === 'enviada' ? 'seu-perfil.png' : './Icon - perfil.png'}
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
