import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';

const baseUrl = 'https://touccan-backend-8a78.onrender.com/2.0/touccan/';

const Historico = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
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
        // Carregar os dados do histórico
        let anunciosAtivos = data.historico.filter((bico) => bico && bico.finalizado === 0);
        
        // Verificar no localStorage se algum anúncio já foi finalizado
        const finalizados = JSON.parse(localStorage.getItem('anuncios_finalizados')) || [];
        anunciosAtivos = anunciosAtivos.map((anuncio) => {
          // Marcar como finalizado se já estiver no localStorage
          if (finalizados.includes(anuncio.id_bico)) {
            anuncio.finalizado = 1;
          }
          return anuncio;
        });

        setAnuncios(anunciosAtivos || []);
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
    console.log('Finalizando pagamento para o anúncio:', { amount, id_bico });

    Swal.fire({
      title: 'Finalizar Expediente',
      text: `Você está prestes a finalizar um expediente. Deseja continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        handleFinalizePayment(id_bico, amount);
      }
    });
  };

  const handleFinalizePayment = (id_bico, amount) => {
    Swal.fire({
      title: 'Pagamento Finalizado',
      text: `O pagamento de R$${amount} foi retirado da sua conta.`,
      icon: 'success',
      confirmButtonText: 'Ok',
    });

    // Atualiza o estado de "anúncios" localmente
    setAnuncios((prevAnuncios) =>
      prevAnuncios.map((anuncio) =>
        anuncio.id_bico === id_bico ? { ...anuncio, finalizado: 1 } : anuncio
      )
    );

    // Armazenar o id_bico no localStorage para persistir a finalização
    const finalizados = JSON.parse(localStorage.getItem('anuncios_finalizados')) || [];
    localStorage.setItem('anuncios_finalizados', JSON.stringify([...finalizados, id_bico]));
  };

  return (
    <div className="bla">
      <Sidebar />
      <div className="histórico-container">
        <h1 className="histórico-title">Histórico</h1>

        {loading ? (
          <div className="carregar1">
            <div className="custom-loader"></div>
          </div>
        ) : anuncios.length === 0 ? (
          <p className="sem-historico">
            Você ainda não tem <br /> nenhum histórico de anúncios.
          </p>
        ) : (
          anuncios.map((anuncio, index) => (
            <div key={index} className="histórico-card">
              <div className="histórico-decorative-line"></div>
              <div className="histórico-card-content">
                <div className="histórico-card-header">
                  <h2>
                    {anuncio.titulo || 'Título não disponível'} - {anuncio.nome || 'Cliente não identificado'}
                  </h2>
                </div>
                <div className="histórico-card-body">
                  <p className="histórico-description">
                    {anuncio.descricao || 'Descrição não fornecida.'}
                  </p>
                  <p className="histórico-date">
                    {new Date(anuncio.data_inicio).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) || 'Indefinido'}
                  </p>
                </div>
                <div className="histórico-card-footer">
                  <button
                    className="histórico-finalize-button"
                    onClick={() => {
                      handleFinalize(anuncio.id_bico, anuncio.salario);
                    }}
                    disabled={anuncio.finalizado !== 0 || isProcessingPayment}
                    style={{
                      backgroundColor: anuncio.finalizado === 1 || isProcessingPayment ? '#B0B0B0' : '#E97911',
                      cursor: anuncio.finalizado !== 0 || isProcessingPayment ? 'not-allowed' : 'pointer',
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
    </div>
  );
};

export default Historico;
