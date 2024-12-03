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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentAnuncio, setCurrentAnuncio] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('id_cliente');
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
        const bicosAtivos = data.historico.filter((bico) => bico && bico.finalizado === 0);
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

  const handleFinalize = (id_bico, amount) => {
    // Criação da preferência de pagamento no backend
    const createPaymentPreference = async () => {
      try {
        const response = await axios.post('http://localhost:8080/criar-pagamento', {
          amount,
          id_bico,
        });
        if (response.data.preference_id) {
          setPreferenceId(response.data.preference_id); // Armazenando o preference_id
          setCurrentAnuncio({ id_bico, amount });
          setShowPaymentModal(true);
        } else {
          console.error('Erro ao criar a preferência de pagamento');
          alert('Erro ao criar a preferência de pagamento');
        }
      } catch (error) {
        console.error('Erro ao criar a preferência de pagamento:', error);
        alert('Erro ao criar a preferência de pagamento');
      }
    };

    createPaymentPreference();
  };

  const handlePaymentSuccess = () => {
    // Atualiza o estado de "finalizado" localmente após o pagamento bem-sucedido
    setAnuncios((prevAnuncios) =>
      prevAnuncios.map((anuncio) =>
        anuncio.id === currentAnuncio.id_bico ? { ...anuncio, finalizado: 1 } : anuncio
      )
    );

    // Fecha o modal de pagamento e mostra o alerta de sucesso
    setShowPaymentModal(false);
    Swal.fire({
      icon: 'success',
      title: 'Pagamento Concluído!',
      text: 'O pagamento foi concluído com sucesso.',
    });
  };

  useEffect(() => {
    if (window.MercadoPago && preferenceId) {
      const mp = new window.MercadoPago('TEST-9e1740aa-6df5-4a3e-b2ba-993d0ec0fb17');

      // Configuração do pagamento com Mercado Pago
      mp.checkout({
        preference: {
          id: preferenceId,
        },
        render: {
          container: '#payment-button', // Renderiza o botão de pagamento no container
          label: 'Pagar', // Texto do botão de pagamento
        },
      });
    }
  }, [preferenceId]);

  console.log(anuncios);

  return (
    <div className="bla">
      <Sidebar />
      <div className="histórico-container">
        <h1 className="histórico-title">Histórico</h1>

        {loading ? (
          <div className="carregar">
            <div className="custom-loader"></div>
          </div>
        ) : anuncios.length === 0 ? (
          <p className="sem-historico">Você ainda não tem <br /> nenhum histórico de anúncios.</p>
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
                    onClick={() => handleFinalize(anuncio.id_bico, anuncio.salario)}
                    disabled={anuncio.finalizado !== 0}
                    style={{
                      backgroundColor: anuncio.finalizado === 1 ? '#B0B0B0' : '#E97911',
                      cursor: anuncio.finalizado !== 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {anuncio.finalizado === 0
                      ? 'Finalizar'
                      : anuncio.finalizado === 1
                        ? 'Finalizado'
                        : 'Pagamento Pendente'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de pagamento */}
      {showPaymentModal && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h2>Finalizar Pagamento</h2>
            <div id="payment-button"></div> {/* Aqui o botão do Mercado Pago será renderizado */}
            <button onClick={() => setShowPaymentModal(false)} className="close-modal-button">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Historico;
