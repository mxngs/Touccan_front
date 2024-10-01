import React, { useState } from 'react';
import './App.css';


function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    data_nascimento: '',
    cep: '',
    senha: '',
    confirmar_senha: ''
  });

  const [erros, setErros] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Formatação automática para telefone, CPF e CEP
    let formattedValue = value;
    if (name === 'telefone') {
      formattedValue = formatTelefone(value);
    } else if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  // Não deixa inserir caracteres não númericos, adiciona os caracteres especiais e limita a 15
  const formatTelefone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2')
      .slice(0, 15); //15 pq ele conta os caracteres
  };

  // Não deixa inserir caracteres não númericos, adiciona os caracteres diferentes e limita a 14
  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{2})$/, '-$1')
      .slice(0, 14);
  };

  // Não deixa inserir caracteres não númericos, limita a 9 caracteres e adiciona o hífen
  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
  };


  const removeSpecialCharacters = (value) => {
    return value.replace(/\D/g, '');
  };

  const validateForm = () => {
    const novosErros = {};

    // Validação de nome (não vazio)
    if (!formData.nome.trim()) {
      novosErros.nome = "O nome é obrigatório";
    }

    // Validação de e-mail
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      novosErros.email = "E-mail inválido";
    }

    // Validação de telefone
    const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!telefoneRegex.test(formData.telefone)) {
      novosErros.telefone = "Telefone inválido";
    }

    // Validação de CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(formData.cpf)) {
      novosErros.cpf = "CPF inválido";
    }

    // Validação de idade (maior de 18 anos)
    const hoje = new Date();
    const dataNascimento = new Date(formData.data_nascimento);
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    if (idade < 18) {
      novosErros.data_nascimento = "Você deve ter pelo menos 18 anos";
    }

    // Validação de CEP
    const cepRegex = /^\d{5}-\d{3}$/;
    if (!cepRegex.test(formData.cep)) {
      novosErros.cep = "CEP inválido";
    }

    // Validação de senha
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!senhaRegex.test(formData.senha)) {
      novosErros.senha = "A senha deve ter no mínimo 8 caracteres, incluindo números, letra maiúscula e um caractere especial";
    }

    // Validação de confirmação de senha
    if (formData.senha !== formData.confirmar_senha) {
      novosErros.confirmar_senha = "As senhas não coincidem";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Remover caracteres especiais dos campos antes de enviar para a API
      const dadosLimpos = {
        ...formData,
        telefone: removeSpecialCharacters(formData.telefone),
        cpf: removeSpecialCharacters(formData.cpf),
        cep: removeSpecialCharacters(formData.cep),
        data_nascimento: formData.data_nascimento, // Data de nascimento não precisa ser alterada
        senha: formData.senha,
        confirmar_senha: undefined // Não enviar o campo confirmar_senha para a API
      };

      console.log("Dados a serem enviados:", dadosLimpos); // Adicionado para depuração

      // Envio dos dados para a API
      fetch('http://localhost:8080/1.0/touccan/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLimpos)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Sucesso:", data);
          // Lógica adicional de sucesso, como redirecionamento
        })
        .catch((error) => {
          console.error("Erro:", error);
          // Lógica adicional de erro
        });
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
        <h1>Cadastro</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, marginRight: '230px' }}>
              <div>
                <img src="./img/usuario.png" alt="Usuário" width={18} />
                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome" />
                {erros.nome && <p style={{ color: 'red' }}>{erros.nome}</p>}
              </div>
              <div>
                <img src="./img/email.png" alt="Email" width={18} />
                <input type="text" name="email" value={formData.email} onChange={handleInputChange} placeholder="E-mail" />
                {erros.email && <p style={{ color: 'red' }}>{erros.email}</p>}
              </div>
              <div>
                <img src="./img/telefone.png" alt="Telefone" width={18} />
                <input type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="Telefone" maxLength={15} />
                {erros.telefone && <p style={{ color: 'red' }}>{erros.telefone}</p>}
              </div>
              <div>
                <img src="./img/cpf.png" alt="CPF" width={18} />
                <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="CPF" maxLength={14} />
                {erros.cpf && <p style={{ color: 'red' }}>{erros.cpf}</p>}
              </div>
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <div>
                <img src="./img/calendario.png" alt="Data de Nascimento" width={18} />
                <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleInputChange} />
                {erros.data_nascimento && <p style={{ color: 'red' }}>{erros.data_nascimento}</p>}
              </div>


              <div>
                <img src="./img/cep.png" alt="CEP" width={18} />
                <input type="text" name="cep" value={formData.cep} onChange={handleInputChange} placeholder="CEP" maxLength={9} />
                {erros.cep && <p style={{ color: 'red' }}>{erros.cep}</p>}
              </div>
              <div>
                <img src="./img/senha.png" alt="Senha" width={18} />
                <input type="password" name="senha" value={formData.senha} onChange={handleInputChange} placeholder="Senha" />
                {erros.senha && <p style={{ color: 'red' }}>{erros.senha}</p>}
              </div>
              <div>
                <img src="./img/senha.png" alt="Confirmar Senha" width={18} />
                <input type="password" name="confirmar_senha" value={formData.confirmar_senha} onChange={handleInputChange} placeholder="Confirmar Senha" />
                {erros.confirmar_senha && <p style={{ color: 'red' }}>{erros.confirmar_senha}</p>}
              </div>
            </div>
          </div>
          <button type="submit" >
            Cadastrar
          </button>
          <div className="teste">
          <p>Já possui conta? <br/>
          <span>Faça seu Login</span>
          </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
