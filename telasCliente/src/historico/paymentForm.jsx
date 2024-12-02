import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentForm = ({ amount, id_bico, onSuccess }) => {
  const [preferenceId, setPreferenceId] = useState(null); // ID da preferência do Mercado Pago

  useEffect(() => {
    // Criação da preferência do pagamento no backend
    const createPaymentPreference = async () => {
      try {
        const response = await axios.post('/create-payment-preference', {
          amount,
          id_bico,
        });

        if (response.data.preference_id) {
          setPreferenceId(response.data.preference_id);
        } else {
          console.error('Erro ao criar a preferência de pagamento');
          alert('Erro ao criar a preferência de pagamento');
        }
      } catch (error) {
        console.error('Erro ao criar a preferência de pagamento:', error);
        alert('Erro ao criar a preferência de pagamento');
      }
    };

    createPaymentPreference(); // Cria a preferência quando o componente é carregado
  }, [amount, id_bico]);

  useEffect(() => {
    // Verifica se o Mercado Pago SDK foi carregado
    if (window.MercadoPago && preferenceId) {
      const mp = new window.MercadoPago('YOUR_PUBLIC_KEY'); // Substitua pela chave pública do Mercado Pago

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

  const handlePaymentSuccess = () => {
    onSuccess(id_bico); // Chama a função de sucesso após o pagamento
  };

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
