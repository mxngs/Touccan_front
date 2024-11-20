import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Importar useParams
import './App.css';
import Sidebar from '../components/Sidebar.jsx';

const PerfilUsuario = () => {
  const { id } = useParams();  // Capturando o id da URL
  const [mudarTab, setMudarTab] = useState('sobre');
  const [dadosCliente, setDadosCliente] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [endereco, setEndereco] = useState(null);

  const handleTabChange = (tab) => {
    setMudarTab(tab);
  };

  const fetchDadosCliente = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/2.0/touccan/usuario/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.usuario && data.usuario.length > 0) {
          const cliente = data.usuario[0]; // Pegando o primeiro usuário da resposta
          setDadosCliente(cliente);
          fetchEndereco(cliente.cep);
          fetchFeedbacks(id);
        }
      }
    } catch (error) {
      console.error('Erro na requisição da API:', error);
    }
  };

  const fetchFeedbacks = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/2.0/touccan/feedback/usuario/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.feedback)) {
          setFeedbacks(data.feedback);
        } else {
          console.warn('A resposta da API não contém um array de feedbacks');
          setFeedbacks([]);
        }
      } else {
        console.error('Erro ao buscar feedbacks:', response.statusText);
        setFeedbacks([]);
      }
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
      setFeedbacks([]);
    }
  };

  const fetchEndereco = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        throw new Error('Erro ao acessar o ViaCEP');
      }

      const enderecoData = await response.json();
      if (enderecoData.erro) {
        throw new Error('CEP inválido');
      }

      setEndereco(enderecoData);
    } catch (error) {
      console.error('Erro ao obter o endereço:', error.message);
      setEndereco(undefined);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDadosCliente(id);
    }
  }, [id]);  // Recarrega quando o id mudar

  return (
    <div className="tela-perfil-user">
      <Sidebar />
      <div className="infos-perfil-user">
        <div className="pfp-perfil-cliente">
          {dadosCliente ? (
            dadosCliente.foto ? (
              <img src={dadosCliente.foto} alt="Foto do Cliente" />
            ) : (
              <img src="../img/semFtoo.png" alt="Sem Foto de Perfil" />
            )
          ) : 'Carregando...'}
        </div>

        <span className="nome-perfil-user">
          {dadosCliente ? dadosCliente.nome : 'Carregando...'}
        </span>

        <div className="tabs">
          <button
            className={`tab-button ${mudarTab === 'sobre' ? 'active' : ''}`}
            onClick={() => handleTabChange('sobre')}
          >
            Sobre Nós
          </button>
          <button
            className={`tab-button ${mudarTab === 'feedback' ? 'active' : ''}`}
            onClick={() => handleTabChange('feedback')}
          >
            Feedback
          </button>
        </div>

        {mudarTab === 'sobre' && (
          <div className="tab-content" id="sobre-perfil-cliente">
            <div className="inputs-perfil-user">
              <div className="formacao-perfil-usuario">
                <input
                  type="text"
                  disabled
                  value={dadosCliente ? dadosCliente.formacao : 'Indefinido'}
                />
              </div>

              <div className="biografia-perfil-usuario">
                <input
                  type="text"
                  value={dadosCliente ? dadosCliente.biografia : 'Indefinido'}
                  disabled
                />
              </div>

              <div className="habilidade-perfil-usuario">
                <input
                  type="text"
                  value={dadosCliente ? dadosCliente.habilidade : 'Indefinido'}
                  disabled
                />
              </div>

              <div className="telefone-perfil-usuario">
                <input
                  type="tel"
                  value={dadosCliente ? dadosCliente.telefone : 'Indefinido'}
                  disabled
                />
              </div>
            </div>
          </div>
        )}

        {mudarTab === 'feedback' && (
          <div className="tab-content" id="feedback-perfil-usuario">
            <div className="feedbacks-list-user">
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <div className="feedback-card-user" key={feedback.id}>
                    <p><strong>Denúncia:</strong> {feedback.denuncia || 'Nenhuma denúncia registrada'}</p>
                    <p><strong>Avaliação:</strong> {feedback.avaliacao || 'Nenhuma avaliação registrada'}</p>
                    <p><strong>Id Bico:</strong> {feedback.id_bico}</p>
                    <p><strong>Id Cliente:</strong> {feedback.id_cliente}</p>
                    <p><strong>Id Usuário:</strong> {feedback.id_usuario}</p>
                  </div>
                ))
              ) : (
                <p>Nenhum feedback encontrado. Verifique se há avaliações ou denúncias feitas por clientes.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilUsuario;
