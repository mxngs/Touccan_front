import React, { useState } from 'react'
import { Outlet, Link } from "react-router-dom";
import { baseUrl } from "../assets/baseUrl.js"
import './login.css'


function Login() {

  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  //validar erros
  const [erros, setErros] = useState({})

  const dados = formData
  const handleSubmit = async (event) => {
    event.preventDefault()
  console.log(formData.email)
    console.log("Dados a serem enviados:", formData);

  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }


    const response = await fetch(`${baseUrl}/login/usuario`, options)
    console.log(response.json())
    .then(response => response.json())
        .then(data => {
          console.log("Sucesso:", data);
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
  }

  const togglePassword = () => {
    const inputSenha = document.getElementById('senha')
    inputSenha.classList.toggle('show')

    if (inputSenha.classList.contains('show'))
      inputSenha.type = 'password'
    else
      inputSenha.type = 'text'
  }

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '46px', justifyContent: 'space-around' }}>
            <div className='input-div'>
              <img src="./img/email.png" alt="Email" width={18} />
              <input type="email" name="email" onChange={(e) => setFormData({...FormData, email: e.target.value})} placeholder="E-mail" />
              {erros.email && <p style={{ color: 'red' }}>{erros.email}</p>}
            </div>
            <div className='input-div'>
              <img src="./img/senha.png" alt="Senha" />
              <input id='senha' type="password" name="senha" onChange={(e) => setFormData({...FormData, senha: e.target.value})} placeholder="Senha" />
              <img src="./img/olho.png" alt="Senha" style={{ width: '30px', height: '30px' }} onClick={togglePassword} />
            </div>
            <a href="#">Esqueceu sua senha?</a>
            {erros.senha && <p style={{ color: 'red' }}>{erros.senha}</p>}
          </div>
          <button type="submit">
            Entrar
          </button>
        </form>
        <Link to="/cadastro">
          Não tem uma conta? <br />
          <span>Faça seu cadastro</span>
        </Link>

      </div>
    </div>

  )
}

export default Login