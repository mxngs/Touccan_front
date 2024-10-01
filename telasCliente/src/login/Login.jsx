import React, { useState } from 'react';
import './App.css';
import { Link } from "react-router-dom"; //import do link
import { useNavigate } from 'react-router-dom'; //import da função de navegar
// Inside the handleLogin function


const baseUrl = 'https://touccan-backend-8a78.onrender.com/2.0/touccan';


function Login() {

  const navigate = useNavigate(); //objeto de navegação

  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [erros, setErros] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();  

    console.log("Dados a serem enviados:", formData);

    try {
      const response = await fetch(`${baseUrl}/login/cliente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Verifica se a resposta é bem-sucedida
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        //se a resposta for bem sucedida vai para a página seguinte
        navigate('/home'); 
      } else {
        const errorText = await response.text();
        console.log("Erro na resposta:", errorText);
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  };

  const togglePassword = () => {
    const inputSenha = document.getElementById('senha');
    inputSenha.classList.toggle('show');

    if (inputSenha.classList.contains('show')) {
      inputSenha.type = 'password';
    } else {
      inputSenha.type = 'text';
    }
  };

  return (
    <div>
      <div className='container'>
        <div className="decoracaoLaranja"></div>
        <div className="decoracaoCinza"></div>
        <div className="decoracaoCinza2"></div>
        <div className="logoPrincipal">
          <img src='../img/logoPrincipal.svg' alt="" />
        </div>
      </div>

      <div className="app-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '46px' }}>
            <div className='input-div'>
              <img src="../img/email.png" alt="Email" width={18} />
              <input
                type="email"
                name="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="E-mail"
              />
            </div>
            <div className='input-div'>
              <img src="../img/senha.png" alt="Senha" />
              <input
                id='senha'
                type="password"
                name="senha"
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                placeholder="Senha"
              />
              <img src="../img/olho.png" alt="Senha" style={{ width: '30px', height: '30px' }} onClick={togglePassword} />
            </div>
            <a href="#">Esqueceu sua senha?</a>
          </div>
          <button type="submit">
            Entrar
          </button>
        </form>

        {/* 
        Precisa usar a tag Link para navegar entre as telas, aí precisa também importar o componente
        import { Link } from "react-router-dom";
         */}
        <Link to="/cadastro">
          Não tem uma conta? <br />
          <span>Faça seu cadastro</span>
        </Link>
      </div>
    </div>
  );
}

export default Login;
