import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Chat from './chat.jsx'; // Importando o componente Chat corretamente

const ListaConversas = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState(null);
  const [chatAtivo, setChatAtivo] = useState(null); // Estado para o chat ativo

  const fetchUsuarios = async (id_cliente) => {
    try {
      const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/relacoes/${id_cliente}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.status_code === 200 && Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error);
      setErro('');
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id_cliente");
    if (id) {
      fetchUsuarios(id);
    } else {
      setErro('ID do cliente não encontrado no localStorage');
      console.error('ID do cliente não encontrado no localStorage');
    }
  }, []);

  return (
    <div className="chat-container">
      <div className="menu-lateral">
        <Link to="/home" className="btn-voltar">
          <img src="../img/voltar.png" alt="" />
        </Link>

        <Link to="/home">
          <a href="">
            <img src="../img/home.png" alt="" />
          </a>
        </Link>

        <Link to="/chat">
          <a href="">
            <img src="../img/chat.png" alt="" />
          </a>
        </Link>

        <Link to="/historico">
          <a href="">
            <img src="../img/historico.png" alt="" />
          </a>
        </Link>

        <Link to="/cofre">
          <a href="">
            <img src="../img/cofrinho.png" alt="" />
          </a>
        </Link>

        <Link to="/configuracao">
          <a href="">
            <img src="../img/configurações.png" alt="" />
          </a>
        </Link>
      </div>

      <div className="area-central">
        <input type="text" className="barra-pesquisa" placeholder="Pesquisar usuário" />
        <div className="linha-laranja"></div>
        <div className="linha-preta"></div>

        <div className="conversas">
          {erro && <p>{erro}</p>} {/* Exibe erro, mas sem bloquear a interface */}
          
          {usuarios.length > 0 ? (
            usuarios.map(({ id_usuario, nome_usuario, foto_usuario }, index) => (
              <div
                key={id_usuario} // Usando id_usuario como chave única
                className="conversa"
                onClick={() => setChatAtivo(id_usuario)} // Quando clica, ativa o chat
              >
                <img src={foto_usuario} alt="Profile" className="icon-conversa" />
                <div className="nome-conversa">{nome_usuario}</div>
                <div className="hora-conversa">10:30</div>
              </div>
            ))
          ) : (
            <div className="semMsg">
              <img src="../img/tucano.png" alt="" />
              <p>Você não possui mensagens...</p>
            </div>
          )}
        </div>

        {/* Exibe o campo de mensagem ou o chat */}
        {chatAtivo ? (
          <Chat chatId={chatAtivo} /> // Exibe o chat ativo
        ) : (
          <div className="mensagem-enviar">
            <img src="../img/semMsg.png" alt="" />
            <p>Envie uma mensagem</p> {/* Mensagem de envio quando nenhum chat está ativo */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaConversas;
