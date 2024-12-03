import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import PaymentForm from './paymentForm.jsx';

const baseUrl = 'https://touccan-backend-8a78.onrender.com/2.0/touccan/';

function Historico() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentAnuncio, setCurrentAnuncio] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
    console.log('Enviando dados de pagamento:', { amount, id_bico });

    setShowPaymentModal(true);
    setCurrentAnuncio({ id_bico, amount });
  };

  // Função para exibir mensagens de sucesso ou erro com SweetAlert2
  const showPaymentStatus = (status, message) => {
    console.log(`Status do pagamento: ${status} - ${message}`);

    if (status === 'success') {
      Swal.fire({
        title: 'Pagamento realizado com sucesso!',
        text: message,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
    } else if (status === 'error') {
      Swal.fire({
        title: 'Erro no pagamento!',
        text: message,
        icon: 'error',
        confirmButtonText: 'Tentar novamente',
      });
    }
  };

  const processPayment = () => {
    console.log("Iniciando o processo de pagamento...");
    setIsProcessingPayment(true); // Marca que o pagamento está sendo processado

    // Simula 50% de chance de sucesso no pagamento
    const isPaymentSuccess = Math.random() > 0.5;

    setTimeout(() => { // Simula um delay no processo de pagamento
      if (isPaymentSuccess) {
        console.log("Pagamento bem-sucedido!");
        showPaymentStatus('success', 'Pagamento processado com sucesso e anúncio finalizado.');

        // Atualiza o status do anúncio localmente para finalizado
        setAnuncios(prevAnuncios =>
          prevAnuncios.map(anuncio =>
            anuncio.id_bico === currentAnuncio.id_bico ? { ...anuncio, finalizado: 1 } : anuncio
          )
        );

      } else {
        console.log("Erro no pagamento!");
        showPaymentStatus('error', 'Erro ao processar o pagamento. Tente novamente.');
      }

      setIsProcessingPayment(false); // Finaliza o processamento do pagamento
    }, 2000); // Simula 2 segundos de delay no processo de pagamento
  };

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
                  <h2>{anuncio.titulo || 'Título não disponível'} - {anuncio.nome || 'Cliente não identificado'} </h2>
                </div>
                <div className="histórico-card-body">
                  <p className="histórico-description">{anuncio.descricao || 'Descrição não fornecida.'}</p>
                  <p className="histórico-date">
                    {new Date(anuncio.data_inicio).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Indefinido'}
                  </p>
                </div>
                <div className="histórico-card-footer">
                  <button
                    className="histórico-finalize-button"
                    onClick={() => {
                      setCurrentAnuncio(anuncio); // Atualiza o anúncio selecionado
                      handleFinalize(anuncio.id_bico, anuncio.salario); // Inicia o processo de pagamento
                    }}
                    disabled={anuncio.finalizado !== 0 || isProcessingPayment} // Desabilita o botão durante o processamento do pagamento
                    style={{
                      backgroundColor: anuncio.finalizado === 1 || isProcessingPayment ? '#B0B0B0' : '#E97911',
                      cursor: anuncio.finalizado !== 0 || isProcessingPayment ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {anuncio.finalizado === 0 ? (isProcessingPayment ? 'Processando...' : 'Finalizar') : anuncio.finalizado === 1 ? 'Finalizado' : 'Pagamento Pendente'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de pagamento */}
      {showPaymentModal && currentAnuncio && (
        <PaymentForm
          amount={currentAnuncio.amount}
          id_bico={currentAnuncio.id_bico}
          onSuccess={() => {
            setShowPaymentModal(false);
            // Atualize o status do anúncio para "finalizado" após sucesso no pagamento
            setAnuncios(prevAnuncios =>
              prevAnuncios.map(anuncio =>
                anuncio.id_bico === currentAnuncio.id_bico ? { ...anuncio, finalizado: 1 } : anuncio
              )
            );
            showPaymentStatus('success', 'Pagamento realizado com sucesso!');
          }}
          onError={(errorMessage) => {
            setShowPaymentModal(false);
            showPaymentStatus('error', `Erro no pagamento: ${errorMessage}`);
          }}
        />
      )}
    </div>
  );
}

export default Historico;
