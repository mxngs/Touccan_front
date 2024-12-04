import React, { useState, useRef } from 'react';
import './App.css';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';  // Importando SweetAlert2

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const navigate = useNavigate();  // Hook para navegação

  // Função para focar no próximo campo quando um campo recebe um valor
  const handleInputChange = (index) => {
    if (inputsRef.current[index].value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Função para mover o foco para o campo anterior quando Backspace é pressionado e o campo está vazio
  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && inputsRef.current[index].value.length === 0 && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Função chamada ao clicar em "Próximo"
  const handleNext = () => {
    if (email && email.includes('@')) { // Validar se o e-mail está preenchido corretamente
      setIsCodeVisible(true); // Exibe os campos de código
      // Exibe uma mensagem de sucesso usando SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Código enviado!',
        text: `Um código foi enviado para ${email}. Verifique sua caixa de entrada.`,
        confirmButtonText: 'Ok',
      });
    } else {
      // Exibe uma mensagem de erro caso o e-mail não seja válido
      Swal.fire({
        icon: 'error',
        title: 'E-mail inválido!',
        text: 'Por favor, insira um e-mail válido.',
        confirmButtonText: 'Ok',
      });
    }
  };

  // Função para atualizar o código
  const handleCodeChange = (index, event) => {
    const newCode = [...code];
    newCode[index] = event.target.value;
    setCode(newCode);

    // Verificar se todos os campos de código foram preenchidos
    if (newCode.every(digit => digit.length === 1)) {
      // Redirecionar para a página "/mudarSenha" quando todos os campos estiverem preenchidos
      navigate("/mudarSenha");
    } else if (event.target.value.length === 1 && index < 5) {
      // Focar automaticamente no próximo campo
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Função para verificar o pressionamento da tecla Enter nos botões
  const handleKeyPress = (event, action) => {
    if (event.key === 'Enter') {
      action();
    }
  };

  // Função para enviar outro código
  const handleSendAnotherCode = () => {
    // Exibe uma mensagem SweetAlert2 quando "Enviar outro" for clicado
    Swal.fire({
      icon: 'success',
      title: 'Novo código enviado!',
      text: `Um novo código foi enviado para ${email}. Verifique sua caixa de entrada.`,
      confirmButtonText: 'Ok',
    });
    // Voltar ao estado inicial (sem mostrar o código)
    setIsCodeVisible(false);
    setCode(['', '', '', '', '', '']);
  };

  return (
    <div className='container2'>
      <div className="decoracaoLaranja-senha"></div>
      <div className="decoracaoCinza-senha"></div>
      <div className="decoracaoCinza2-senha"></div>
      <div className="logoPrincipal">
        <img src='../img/logoPrincipal.svg' alt="Logo Principal" />
      </div>

      {/* Botão "Voltar para o Login" */}
      <Link to= "/"><div className="botaoLoginVlt">Voltar</div></Link>

      <div className="content-container2">
        <div id="feedback" className="feedback"></div>

        <div className="cardSenha">
          <h2>
            {isCodeVisible ? (
              <>Digite o código enviado para <p>{email}</p></>
            ) : (
              <>Digite seu e-mail</>
            )}
          </h2>

          {/* Exibe o campo de e-mail ou código */}
          {!isCodeVisible ? (
            <div className="email-input">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="input-email"
                onKeyDown={(e) => handleKeyPress(e, handleNext)} // Permite avançar com Enter
              />
              <div className="btLaranja">
                <button 
                  className="btnlaranja" 
                  onClick={handleNext}
                  onKeyDown={(e) => handleKeyPress(e, handleNext)} // Permite avançar com Enter
                >
                  Próximo
                </button>
              </div>
            </div>
          ) : (
            <div className="codigo-inputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputsRef.current[index] = el}
                  type="text"
                  maxLength="1"
                  className="codigo-digit"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mostrar "Não recebeu um código?" somente quando os campos de código forem visíveis */}
        {isCodeVisible && (
          <div className="codigo">
            Não recebeu um código? 
            <div className="enviarOutro">
              <button 
                id="atualizar" 
                className="btnLaranja" 
                onClick={handleSendAnotherCode} // Ação ao clicar para enviar outro código
              >
                Enviar outro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecuperarSenha;
