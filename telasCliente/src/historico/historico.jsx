import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

const baseUrl = 'https://touccan-backend-8a78.onrender.com/2.0/touccan/';

function Historico() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id_cliente");
    if (id) fetchData(id);
    else {
      console.error('ID do cliente não encontrado no localStorage');
      alert('Erro: ID do cliente não encontrado. Faça login novamente.');
    }
  }, []);

  const fetchData = async (id) => {
    try {
      const response = await fetch(`${baseUrl}cliente/historico/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error(`Erro: ${response.status} - ${response.statusText}`);
  
      const data = await response.json();
      console.log('Resposta da API:', data);
  
      // Atualize o filtro conforme sua lógica:
      const bicosAtivos = data.historico.filter(bico => bico && bico.finalizado === 1); // Exemplo para bicos finalizados
      setAnuncios(bicosAtivos || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao carregar os dados do histórico. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleFinalize = async (id) => {
    try {
      const response = await fetch(`${baseUrl}bico/finalizar/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Erro ao finalizar bico: ${response.statusText}`);

      setAnuncios(prevAnuncios => prevAnuncios.filter(anuncio => anuncio.id !== id));
      alert('Bico finalizado com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar o bico:', error);
      alert('Erro ao finalizar o bico. Tente novamente.');
    }
  };

  return (
    <div className="bla">
      <Sidebar />
    <div className="histórico-container">
      
      <h1 className="histórico-title">Histórico</h1>

      {loading ? (
        <p className="histórico-loading">Carregando...</p>
      ) : (
        anuncios.length === 0 ? (
          <p>Nenhum bico ativo encontrado.</p>
        ) : (
          anuncios.map((anuncio, index) => (
            <div key={index} className="histórico-card">
              <div className="histórico-decorative-line"></div>
              <div className="histórico-card-content">
                <div className="histórico-card-header">
                  <h2>{anuncio.titulo || 'Título não disponível'}</h2>
                  <img
                    src={anuncio.foto || 'https://via.placeholder.com/150'}
                    alt="Imagem do anúncio"
                    className="histórico-card-image"
                  />
                </div>
                <div className="histórico-card-body">
                  <p className="histórico-description">{anuncio.descricao || 'Descrição não fornecida.'}</p>
                  <p className="histórico-client-name">{anuncio.nome || 'Cliente não identificado'}</p>
                  <p className="histórico-salary">Salário: R$ {anuncio.salario?.toFixed(2) || '0.00'}</p>
                  <p className="histórico-date">
                    Data Início: {new Date(anuncio.data_inicio).toLocaleString() || 'Indefinido'}
                  </p>
                  <p className="histórico-date">
                    Data Limite: {new Date(anuncio.data_limite).toLocaleString() || 'Indefinido'}
                  </p>
                </div>
                <div className="histórico-card-footer">
                  <button
                    className="histórico-finalize-button"
                    onClick={() => handleFinalize(anuncio.id)}
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            </div>
          ))          
        )
      )}
    </div>
    </div>
  );
}

export default Historico;
