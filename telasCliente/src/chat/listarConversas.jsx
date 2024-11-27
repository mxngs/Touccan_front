import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const ListaConversas = () => {
  const [conversas, setConversas] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Simulação de API com conversa exemplo
    const fetchConversas = async () => {
      try {
        // Simulando o retorno da API
        const data = {
          conversa1: [
            { tipo: 'recebida', texto: 'Oi, tudo bem?', nome: 'João' }
          ]
        };
        setConversas(data);
      } catch (error) {
        console.error('Erro ao carregar conversas:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchConversas();
  }, []);

  if (carregando) {
    return <div>Carregando conversas...</div>;
  }

  return (
    <div className="area-central">
      {/* Botão de Voltar */}
      <div className="menu-lateral">
        <Link to="/home" className="btn-voltar">
          &#8592; Voltar
        </Link>
      </div>

      {/* Barra de Pesquisa */}
      <input type="text" className="barra-pesquisa" placeholder="Pesquisar conversa" />
      <div className="linha-laranja"></div>
      <div className="linha-preta"></div>

      {/* Lista de Conversas */}
      <div className="conversas">
        {Object.keys(conversas).map((id) => {
          const { nome, texto } = conversas[id][0];
          return (
            <Link to={`/chat/${id}`} key={id} className="conversa">
              <img src="./Imagem - Perfil.png" alt="Profile" className="icon-conversa" />
              <div className="nome-conversa">{nome}</div>
              <div className="mensagem-conversa">{texto}</div>
              <div className="hora-conversa">10:30</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ListaConversas;
