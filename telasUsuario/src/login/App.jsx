import React, { useState } from 'react'
import './App.css'


const baseUrl = 'http://localhost:8080/1.0/touccan'
function App() {

    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });

     //validar erros
     const [erros, setErros] = useState({})

     //validar o formulário
     const validateForm = () => {
         const novosErros = {}

         // validação de e-mail
         const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
         if (!emailRegex.test(formData.email)) {
             novosErros.email = "E-mail inválido";
         }

        setErros(novosErros)

         return Object.keys(novosErros).length === 0
     }
      
    const handleSubmit = async (event) => {
      
        event.prefentDefault()

        console.log("Dados a serem enviados:", dados);

        const response = await fetch(`${baseUrl}/login/usuario?email=${formData.email}&senha=${formData.senha}`,{
            method: 'GET'
        }).then(response => response.json())
        .then(data => {console.log(data)})
        .catch(error => {
            console.log("Erro:" + data)
            event.prefentDefault()
        })
    }


    const togglePassword = () =>{
        const inputSenha = document.getElementById('senha')
        inputSenha.classList.toggle('show')

        if(inputSenha.classList.contains('show'))
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '46px' }}>
                <div className='input-div'>
                  <img src="./img/email.png" alt="Email" width={18} />
                  <input type="text" name="email"  onChange={(e) => setFormData(e.target.value)} placeholder="E-mail" />
                  {erros.email && <p style={{ color: 'red' }}>{erros.email}</p>}
                </div>
                <div className='input-div'>
                  <img src="./img/senha.png" alt="Senha" />
                  <input id='senha' type="password" name="senha"  onChange={(e) => setFormData(e.target.value)} placeholder="Senha" />
                  <img src="./img/olho.png" alt="Senha"style={{width: '30px', height: '30px'}} onClick={togglePassword} />
                </div>
                <a href="#">Esqueceu sua senha?</a>
                {erros.senha && <p style={{ color: 'red' }}>{erros.senha}</p>}
            </div>
            <button type="submit">
              Entrar
            </button>
          </form>
            <p>
              Não tem uma conta? <br />
              <span>Faça seu cadastro</span>
              </p>
            
        </div>
      </div>

    )
}

export default App