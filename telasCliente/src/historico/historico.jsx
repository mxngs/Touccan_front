import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';

const baseUrl = 'https://touccan-backend-8a78.onrender.com/2.0/touccan/';

function Historico() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id_cliente");
    if (id) {
      fetchData(id);
    } else {
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


      if (!response.ok) {
        console.error('Erro ao buscar dados:', response.statusText);
        alert('Erro ao carregar os dados do histórico. Tente novamente.');
        return;
      }

      const data = await response.json();
      console.log('Dados retornados da API:', data); 

      if (data.historico && Array.isArray(data.historico)) {
        const bicosAtivos = data.historico.filter(bico => bico && bico.finalizado === 0);
        setAnuncios(bicosAtivos || []);
      } else {
        console.error('A chave "historico" não foi encontrada ou não é um array válido');
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao carregar os dados do histórico. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (id_bico) => {
    try {
      const paymentData = {
        id_bico: id_bico, 
        final_c: 1, 
      };

      console.log('Dados que estão sendo enviados:', paymentData);

      const response = await axios.post(`${baseUrl}finalizar/cliente`, paymentData);

      if (response.data && response.data.sucesso) {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Bico finalizado com sucesso!',
        });
        setAnuncios(anuncios.map(anuncio => 
          anuncio.id === id_bico ? { ...anuncio, finalizado: 1 } : anuncio
        ));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: response.data?.message || 'Erro desconhecido ao finalizar o bico.',
        });
      }
    } catch (error) {
      console.error('Erro ao tentar finalizar:', error);

      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: `Erro ao finalizar o bico: ${error.response.data.message || "Erro desconhecido."}`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro desconhecido ao tentar finalizar o bico.',
        });
      }
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
                    <h2> {anuncio.nome || 'Indefinido'}  - {anuncio.titulo || 'Título não disponível'}</h2>
                    <div className="histórico-card-footer">
                      <button
                        className={`histórico-finalize-button ${anuncio.finalizado === 1 ? 'disabled' : ''}`}
                        onClick={() => handleFinalize(anuncio.id)} 
                        disabled={anuncio.finalizado === 1}
                      >
                        {anuncio.finalizado === 1 ? 'Finalizado' : 'Finalizar'}
                      </button>
                      <p className="histórico-date">Horário de início: {isNaN(new Date(anuncio.horario_inicio)) ? 'Indefinido' : new Date(anuncio.horario_inicio).toLocaleString()}</p>
                      <p className="histórico-date">Horário limite: {isNaN(new Date(anuncio.horario_limite)) ? 'Indefinido' : new Date(anuncio.horario_limite).toLocaleString()}</p>
                    </div>
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
