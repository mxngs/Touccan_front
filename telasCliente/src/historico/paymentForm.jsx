import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentForm = ({ amount, id_bico, onSuccess }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [paymentData, setPaymentData] = useState({
    token: '',
    paymentMethodId: '',
    email: '',
    installments: 1,
    identificationType: 'CPF',
    number: '12345678900' // Um número de exemplo, mas será substituído
  });

  // Função para obter o e-mail do cliente
  const getEmailCliente = async (id_cliente) => {
    try {
      const response = await axios.get(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/${id_cliente}`);
      if (response.data && response.data.email) {
        setPaymentData((prevData) => ({
          ...prevData,
          email: response.data.email
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar o e-mail do cliente:', error);
    }
  };

  // Função para obter o número do cartão do cliente
  const getNumeroCartao = async (id_cliente) => {
    try {
      const response = await axios.get(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/cartao/${id_cliente}`);
      if (response.data && response.data.numero) {
        setPaymentData((prevData) => ({
          ...prevData,
          number: response.data.numero
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar o número do cartão do cliente:', error);
    }
  };

  useEffect(() => {
    const id_cliente = localStorage.getItem('id_cliente'); // Obtém o ID do cliente logado

    if (id_cliente) {
      getEmailCliente(id_cliente);
      getNumeroCartao(id_cliente);
    }
  }, []);

  useEffect(() => {
    const createPaymentPreference = async () => {
      try {
        // Verifique se todos os dados necessários estão preenchidos antes de fazer o envio
        if (paymentData.token && paymentData.paymentMethodId && paymentData.email && paymentData.number) {
          const response = await axios.post('http://localhost:8080/criar-pagamento', {
            amount,
            id_bico,
            token: paymentData.token,
            paymentMethodId: paymentData.paymentMethodId,
            email: paymentData.email,
            installments: paymentData.installments,
            identificationType: paymentData.identificationType,
            number: paymentData.number
          });

          if (response.data && response.data.payment) {
            console.log('Pagamento bem-sucedido:', response.data.payment);
            onSuccess(id_bico); // Chama a função de sucesso após o pagamento
          } else {
            console.error('Erro ao processar pagamento:', response.data.error);
          }
        } else {
          console.error('Dados de pagamento incompletos');
          alert('Por favor, preencha todos os dados de pagamento.');
        }
      } catch (error) {
        console.error('Erro ao criar a preferência de pagamento:', error);
        alert('Erro ao criar a preferência de pagamento');
      }
    };

    if (paymentData.email && paymentData.number && paymentData.token) {
      createPaymentPreference(); // Só chama a criação do pagamento se todos os dados estiverem prontos
    }
  }, [amount, id_bico, paymentData, onSuccess]);

  useEffect(() => {
    // Verifica se o Mercado Pago SDK foi carregado
    if (window.MercadoPago && preferenceId) {
      const mp = new window.MercadoPago('TEST-9e1740aa-6df5-4a3e-b2ba-993d0ec0fb17'); // Substitua pela chave pública do Mercado Pago

      // Cria o botão de pagamento do Mercado Pago
      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '#payment-button', // O botão de pagamento será renderizado neste container
          label: 'Pagar', // Texto do botão
        }
      });
    }
  }, [preferenceId]);

  return (
    <div>
      {preferenceId ? (
        <div>
          <h2>Finalizar pagamento</h2>
          <div id="payment-button"></div> {/* O botão de pagamento do Mercado Pago será renderizado aqui */}
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default PaymentForm;
