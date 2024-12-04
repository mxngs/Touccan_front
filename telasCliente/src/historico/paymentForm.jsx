// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const PaymentForm = ({ amount, id_bico, onSuccess, onError }) => {
//   const [paymentData, setPaymentData] = useState({
//     token: '',
//     paymentMethodId: '',
//     email: '',
//     installments: 1,
//     identificationType: 'CPF',
//     number: '12345678900' // Um número de exemplo, mas será substituído
//   });

//   // Função para obter o e-mail do cliente
//   const getEmailCliente = async (id_cliente) => {
//     try {
//       const response = await axios.get(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/${id_cliente}`);
//       if (response.data && response.data.email) {
//         setPaymentData((prevData) => ({
//           ...prevData,
//           email: response.data.email
//         }));
//       }
//     } catch (error) {
//       console.error('Erro ao buscar o e-mail do cliente:', error);
//       Swal.fire({
//         title: 'Erro!',
//         text: 'Erro ao buscar o e-mail do cliente. Tente novamente.',
//         icon: 'error',
//         confirmButtonText: 'Ok',
//       });
//     }
//   };

//   // Função para obter o número do cartão do cliente
//   const getNumeroCartao = async (id_cliente) => {
//     try {
//       const response = await axios.get(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/cartao/${id_cliente}`);
//       if (response.data && response.data.numero) {
//         setPaymentData((prevData) => ({
//           ...prevData,
//           number: response.data.numero
//         }));
//       }
//     } catch (error) {
//       console.error('Erro ao buscar o número do cartão do cliente:', error);
//       Swal.fire({
//         title: 'Erro!',
//         text: 'Erro ao buscar o número do cartão do cliente. Tente novamente.',
//         icon: 'error',
//         confirmButtonText: 'Ok',
//       });
//     }
//   };

//   // Função para criar o token
//   const createPaymentToken = () => {
//     const mp = new window.MercadoPago('TEST-9e1740aa-6df5-4a3e-b2ba-993d0ec0fb17'); // Substitua pela chave pública do Mercado Pago

//     // Criação do objeto do cartão de crédito
//     const card = {
//       number: paymentData.number, // Número do cartão
//       security_code: paymentData.token, // CVV
//       expiration_month: '12', // Mês de validade
//       expiration_year: '2025', // Ano de validade
//       cardholder: {
//         name: 'Cliente Exemplo', // Nome do titular
//         identification: {
//           type: 'CPF', // Tipo de documento
//           number: paymentData.number // Número do CPF
//         }
//       }
//     };

//     // Cria o token com os dados do cartão
//     mp.createToken(card).then((response) => {
//       const { id } = response; // Token gerado
//       setPaymentData((prevData) => ({
//         ...prevData,
//         token: id // Armazena o token gerado
//       }));
//       // Enviar os dados ao backend após gerar o token
//       submitPayment(id);
//     }).catch((error) => {
//       console.error('Erro ao gerar token:', error);
//       Swal.fire({
//         title: 'Erro!',
//         text: 'Erro ao gerar o token do cartão. Tente novamente.',
//         icon: 'error',
//         confirmButtonText: 'Ok',
//       });
//     });
//   };

//   // Função para enviar os dados para o backend
//   const submitPayment = async (token) => {
//     try {
//       const response = await axios.post('http://localhost:8080/criar-pagamento', {
//         amount,
//         id_bico,
//         token: paymentData.token,
//         paymentMethodId: paymentData.paymentMethodId,
//         email: paymentData.email,
//         installments: paymentData.installments,
//         identificationType: paymentData.identificationType,
//         number: paymentData.number
//       });

//       if (response.data && response.data.payment) {
//         console.log('Pagamento bem-sucedido:', response.data.payment);
//         onSuccess(id_bico); // Chama a função de sucesso após o pagamento
//         Swal.fire({
//           title: 'Sucesso!',
//           text: 'Pagamento realizado com sucesso!',
//           icon: 'success',
//           confirmButtonText: 'Ok',
//         });
//       } else {
//         console.error('Erro ao processar pagamento:', response.data.error);
//         Swal.fire({
//           title: 'Erro!',
//           text: 'Erro ao processar o pagamento. Tente novamente.',
//           icon: 'error',
//           confirmButtonText: 'Ok',
//         });
//         onError('Erro ao processar o pagamento. Tente novamente.');
//       }
//     } catch (error) {
//       console.error('Erro ao criar a preferência de pagamento:', error);
//       Swal.fire({
//         title: 'Erro!',
//         text: 'Erro ao criar a preferência de pagamento. Tente novamente.',
//         icon: 'error',
//         confirmButtonText: 'Ok',
//       });
//       onError('Erro ao criar a preferência de pagamento');
//     }
//   };

//   useEffect(() => {
//     const id_cliente = localStorage.getItem('id_cliente'); // Obtém o ID do cliente logado

//     if (id_cliente) {
//       getEmailCliente(id_cliente);
//       getNumeroCartao(id_cliente);
//     }
//   }, []);

//   return (
//     <div>
//       <h2>Finalizar pagamento</h2>
//       <div>
//         <button onClick={createPaymentToken}>
//           Pagar {amount} BRL
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentForm; import React, { useState, useEffect } from 'react';