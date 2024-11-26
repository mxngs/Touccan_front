import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

// Definição das conversas
const conversas = {
  conversa1: [
    { tipo: 'recebida', texto: 'Oi, tudo bem?', nome: 'João' },
  ],
  conversa2: [
    { tipo: 'recebida', texto: 'Olá', nome: 'Maria' },
  ],
  conversa3: [
    { tipo: 'recebida', texto: 'Está chegando?', nome: 'Carlos' },
  ]
};

const Mensagem = () => {
  // Estado para armazenar a conversa selecionada e a mensagem atual
  const [chatSelecionado, setChatSelecionado] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState('');

  // Função para selecionar a conversa
  const selecionarConversa = (id) => {
    console.log('Conversa selecionada:', id); // Verifica qual conversa está sendo selecionada
    setChatSelecionado(id);
  };

  // Função para enviar a mensagem
  const enviarMensagem = () => {
    if (novaMensagem.trim() !== '') {
      // Adiciona a nova mensagem ao chat
      const updatedConversas = { ...conversas };
      updatedConversas[chatSelecionado] = [
        ...updatedConversas[chatSelecionado],
        { tipo: 'enviada', texto: novaMensagem }
      ];
      conversas[chatSelecionado] = updatedConversas[chatSelecionado]; // Atualiza no objeto global

      setNovaMensagem('');
    }
  };

  return (
    <div className="chat-container">
      {/* Menu Lateral */}
      <div className="menu-lateral">
        <Link to="/home" className="btn-voltar">
          &#8592; Voltar
        </Link>
      </div>

      {/* Área Central com a lista de conversas */}
      {!chatSelecionado ? (
        <div className="area-central">
          <input type="text" className="barra-pesquisa" placeholder="Pesquisar conversa" />
          <div className="linha-laranja"></div>
          <div className="linha-preta"></div>

          <div className="conversas">
            {Object.keys(conversas).map((id) => {
              const { nome } = conversas[id][0];
              return (
                <div key={id} className="conversa" onClick={() => selecionarConversa(id)}>
                  <img src="./Imagem - Perfil.png" alt="Profile" className="icon-conversa" />
                  <div className="nome-conversa">{nome}</div>
                  <div className="mensagem-conversa">{conversas[id][conversas[id].length - 1].texto}</div>
                  <div className="hora-conversa">10:30</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Exibição do chat selecionado
        <div className="lado-direito">
          <div className="chat">
            <div className="chat-header">
              <Link to="/" className="btn-voltar-chat">&#8592; Voltar</Link>
              <div className="nome-pessoa-chat">
                {conversas[chatSelecionado][0].nome}
              </div>
              <div className="linha-laranja"></div>
            </div>

            <div className="chat-conversa">
              {conversas[chatSelecionado].map((msg, index) => (
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

            {/* Input de nova mensagem */}
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
      )}
    </div>
  );
};

export default Mensagem;
