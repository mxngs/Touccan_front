import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

const baseUrl = 'http://localhost:8080/2.0/touccan';

function Historico() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id_cliente");
    if (id) fetchData(id);
    else console.error('ID do cliente não encontrado no localStorage');
  }, []);

  
  const fetchData = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/bico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cliente: id }),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);
      setAnuncios(data.bico || []); // Atualiza o estado com os títulos dos anúncios
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="histórico-container">

<Sidebar />

      <h1 className="histórico-title">Histórico</h1>
      
      {loading ? (
        <p className="histórico-loading">Carregando...</p>
      ) : (
        anuncios.length === 0 ? (
          <p>Nenhum anúncio encontrado.</p>
        ) : (
          anuncios.map((anuncio, index) => (
            <div key={index} className="histórico-card">
              <div className="histórico-decorative-line"></div>
              <div className="histórico-card-content">
                <div className="histórico-card-header">
                  <h2>{anuncio.titulo}</h2> {/* Título do anúncio */}
                  <div className="histórico-card-footer">
                    <button className="histórico-finalize-button">Finalizar</button>
                    <p className="histórico-date">17/05</p>
                  </div>
                </div>
                <p className="histórico-expiry-text">Esse anúncio expira em 1h</p>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}

export default Historico;
