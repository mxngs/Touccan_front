import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import DetalhesVaga from '../components/DetalhesVaga.jsx';
import AvaliarModal from '../components/Avaliacao.jsx'; 
import './App.css'; 

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('perto');
  const [anuncios, setAnuncios] = useState([]);
  const [trabalhosPendentes, setTrabalhosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anuncioSelecionado, setAnuncioSelecionado] = useState(null);
  const [trabalhoSelecionado, setTrabalhoSelecionado] = useState(null); 
  const [modalAvaliarAberto, setModalAvaliarAberto] = useState(false); 

  const navigate = useNavigate(); 

  useEffect(() => {
    const id = localStorage.getItem("id_cliente");
    if (id) {
      fetchData(id); 
      fetchTrabalhosPendentes(id); 
    } else {
      console.error('ID do cliente não encontrado no localStorage');
    }
  }, []);

  const fetchData = async (id) => {
    try {
      const response = await fetch('https://touccan-backend-8a78.onrender.com/bico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cliente: id }),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados de anúncios recebidos:', data);
      setAnuncios(Array.isArray(data.bico) ? data.bico : []);
    } catch (error) {
      console.error('Erro ao buscar dados de anúncios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrabalhosPendentes = async (id) => {
    try {
      const response = await fetch(`https://touccan-backend-8a78.onrender.com/cliente/historico/${id}`);

      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados de trabalhos pendentes recebidos:', data);
      setTrabalhosPendentes(Array.isArray(data.historico) ? data.historico : []);
    } catch (error) {
      console.error('Erro ao buscar dados de trabalhos pendentes:', error);
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);
  const showDetalhesAnuncio = (anuncio) => setAnuncioSelecionado(anuncio);
  const fecharModal = () => setAnuncioSelecionado(null);

  const abrirModalAvaliar = (trabalho) => {
    setTrabalhoSelecionado(trabalho); 
    setModalAvaliarAberto(true); 
    
    navigate(`/avaliacao/${trabalho.id}`); 
  };

  const fecharModalAvaliar = () => {
    setModalAvaliarAberto(false);
    setTrabalhoSelecionado(null); 
  };

  return (
    <div className="main-content">
      {loading && (
        <div className="carregar">
          <div className="custom-loader"></div>
        </div>
      )}

      <div className="tabs">
        <button className={`tab-button ${activeTab === 'perto' ? 'active' : ''}`} onClick={() => handleTabChange('perto')}>
          Meus anúncios
        </button>
        <button className={`tab-button ${activeTab === 'urgente' ? 'active' : ''}`} onClick={() => handleTabChange('urgente')}>
          Trabalhos pendentes
        </button>
      </div>

      <div className={`tab-content ${activeTab === 'perto' ? 'active' : ''}`}>
        {anuncios.length > 0 ? (
          anuncios.map((anuncio) => (
            <div className="job-card" key={anuncio.id} onClick={() => showDetalhesAnuncio(anuncio)}>
              <div className="job-info">
                <h3 className="job-title">{anuncio.titulo}</h3>
                <p className="job-description">{anuncio.descricao}</p>
                <div className="job-timing">
                  Local: {anuncio.cliente?.[0]?.nome_fantasia || 'Não disponível'} <br />
                  Horário: {new Date(anuncio.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(anuncio.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                  Preço: R$ {anuncio.salario.toFixed(2)}
                </div>
                <button className="btn-ver-candidatos">Ver detalhes</button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum anúncio encontrado.</p>
        )}
      </div>

      <div className={`tab-content ${activeTab === 'urgente' ? 'active' : ''}`}>
        {trabalhosPendentes.length > 0 ? (
          trabalhosPendentes.map((trabalho) => (
            <div className="job-card" key={trabalho.id} onClick={() => showDetalhesAnuncio(trabalho)}>
              <div className="job-info">
                <h3 className="job-name">
                  <img 
                    src={trabalho.foto ? trabalho.foto : './img/semFtoo.jpg'} 
                    className="job-image" 
                    alt=""
                  />
                  <span className="job-person-name">{trabalho.nome}</span>
                </h3>
                <div className="job-title">{trabalho.titulo}</div>
                <div className="job-descricao">{trabalho.descricao}</div>
                <div className="job-timing">
                  Local: {trabalho.cliente?.[0]?.nome_fantasia || 'Não disponível'} <br />
                  Horário: {new Date(trabalho.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(trabalho.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                  Preço: {typeof trabalho.salario === 'number' ? `R$ ${trabalho.salario.toFixed(2)}` : 'Não disponível'}
                </div>
                <button className="btn-avaliar" onClick={() => abrirModalAvaliar(trabalho)}>
                  Avaliar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Sem trabalhos pendentes.</p>
        )}
      </div>

      {anuncioSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DetalhesVaga anuncio={anuncioSelecionado} onClose={fecharModal} />
          </div>
        </div>
      )}

      {modalAvaliarAberto && trabalhoSelecionado && (
        <div className="modal-overlay" onClick={fecharModalAvaliar}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AvaliarModal trabalho={trabalhoSelecionado} onClose={fecharModalAvaliar} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
