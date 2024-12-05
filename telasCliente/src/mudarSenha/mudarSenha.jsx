
import React, { useState } from 'react';
import './App.css';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Importando o SweetAlert2

//finalizado-camposnfezobglh certo
const MudarSenha = () => {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackTipo, setFeedbackTipo] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

  // Alterna a visibilidade da senha
  const toggleSenha = () => {
    setSenhaVisivel(!senhaVisivel);
  };

  const toggleConfirmarSenha = () => {
    setConfirmarSenhaVisivel(!confirmarSenhaVisivel);
  };

  // Valida as senhas
  const validaSenhas = () => {
    if (senha.length < 8 || confirmarSenha.length < 8) {
      setFeedback('As senhas devem ter no mínimo 8 caracteres');
      setFeedbackTipo('erro');
    } else if (senha !== confirmarSenha) {
      setFeedback('Senhas não coincidem');
      setFeedbackTipo('erro');
    } else {
      setFeedback('');
      setFeedbackTipo('');
    }
  };

  // Ao digitar no campo de senha ou confirmar senha
  const handleChangeSenha = (e) => {
    setSenha(e.target.value);
    validaSenhas();
  };

  const handleChangeConfirmarSenha = (e) => {
    setConfirmarSenha(e.target.value);
    validaSenhas();
  };

  // Função para chamar a API para atualizar a senha
  const handleAtualizar = async () => {
    if (senha === confirmarSenha && senha.length >= 8 && confirmarSenha.length >= 8) {
      try {
        const id_cliente = 1; // Substitua pelo ID do cliente que deseja atualizar a senha
        const response = await fetch(`/2.0/touccan/senha/cliente/${id_cliente}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ senha }),
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Senha alterada com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: errorData.message || 'Erro ao alterar a senha',
            showConfirmButton: true,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao alterar a senha',
          showConfirmButton: true,
        });
      }
    }
  };

  return (
    <div className="container4">
      <div className="decoracaoLaranja-senha"></div>
      <div className="decoracaoCinza-senha"></div>
      <div className="decoracaoCinza2-senha"></div>
      <div className="logoPrincipal">
        <img src="../img/logoPrincipal.svg" alt="Logo Principal" />
      </div>

      {/* Botão "Voltar para o Login" */}
      <Link to= "/"><div className="botaoLoginVlt">Voltar</div></Link>

      <div className="container-mudar">
        <div className="card-mudar">
          <h2 className='mudar'>Crie uma nova senha</h2>

          <div className="inputt-container">
            <label htmlFor="senha">Senha</label>
            <div className="input-wrapper">
              <span className="lock-icon">&#128274;</span>
              <input
                type={senhaVisivel ? 'text' : 'password'}
                id="senha"
                value={senha}
                onChange={handleChangeSenha}
                placeholder="Senha"
                minLength="8"
              />
              <span className="eye-icon" onClick={toggleSenha}>
                &#128065;
              </span>
            </div>
          </div>

          <div className="inputt-container">
            <label htmlFor="confirmarSenha">Confirme sua senha</label>
            <div className="input-wrapper">
              <span className="lock-icon">&#128274;</span>
              <input
                type={confirmarSenhaVisivel ? 'text' : 'password'}
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={handleChangeConfirmarSenha}
                placeholder="Confirme sua senha"
                minLength="8"
              />
              <span className="eye-icon" onClick={toggleConfirmarSenha}>
                &#128065;
              </span>
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`feedback ${feedbackTipo === 'erro' ? 'error' : ''}`}>
            {feedback}
          </div>
        )}

        <button
          id="atualizar"
          className="btn-laranja"
          onClick={handleAtualizar}
          disabled={senha !== confirmarSenha || senha.length < 8 || confirmarSenha.length < 8}
        >
          Atualizar
        </button>
      </div>
    </div>
  );
};

export default MudarSenha;


