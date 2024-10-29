import React, { useState } from 'react';
import './App.css';
import { Link } from "react-router-dom";

function Cadastro() {
  const [formData, setFormData] = useState({
    nome_responsavel: '',
    email: '',
    telefone: '',
    cpf_responsavel: '',
    data_nascimento: '',
    cep: '',
    senha: '',
    confirmar_senha: '',
    nome_fantasia: '',
    razao_social: '',
    cnpj: ''
  });

  const [erros, setErros] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'telefone') {
      formattedValue = formatTelefone(value);
    } else if (name === 'cpf_responsavel') {
      formattedValue = formatCPF(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    } else if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const formatTelefone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2')
      .slice(0, 15);
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{2})$/, '-$1')
      .slice(0, 14);
  };

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{2})$/, '-$1')
      .slice(0, 18);
  };

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

    if (!formData.nome_responsavel.trim()) {
      novosErros.nome_responsavel = "O nome é obrigatório";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      novosErros.email = "E-mail inválido";
    }

    const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!telefoneRegex.test(formData.telefone)) {
      novosErros.telefone = "Telefone inválido";
    }

    const cpf_responsavelRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpf_responsavelRegex.test(formData.cpf_responsavel)) {
      novosErros.cpf_responsavel = "CPF inválido";
    }

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

    const cepRegex = /^\d{5}-\d{3}$/;
    if (!cepRegex.test(formData.cep)) {
      novosErros.cep = "CEP inválido";
    }

    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!senhaRegex.test(formData.senha)) {
      novosErros.senha = "A senha deve ter no mínimo 8 caracteres, incluindo números, letra maiúscula e um caractere especial";
    }

    if (formData.senha !== formData.confirmar_senha) {
      novosErros.confirmar_senha = "As senhas não coincidem";
    }

    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!cnpjRegex.test(formData.cnpj)) {
      novosErros.cnpj = "CNPJ inválido";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dadosLimpos = {
        ...formData,
        telefone: removeSpecialCharacters(formData.telefone),
        cpf_responsavel: removeSpecialCharacters(formData.cpf_responsavel),
        cnpj: removeSpecialCharacters(formData.cnpj),
        cep: removeSpecialCharacters(formData.cep),
        data_nascimento: formData.data_nascimento,
        senha: formData.senha,
        confirmar_senha: undefined
      };

      console.log("Dados a serem enviados:", dadosLimpos);

      fetch('http://localhost:8080/1.0/touccan/cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLimpos)
      })

      
        .then(response => response.json())
        .then(data => {
          console.log("Sucesso:", data);
          navigate('/login');
        })
        .catch((error) => {
          console.error("Erro:", error);
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '230px' }}>
              <div>
                <img src="./img/usuario.png" alt="Usuário" width={18} />
                <input type="text" name="nome_responsavel" value={formData.nome_responsavel} onChange={handleInputChange} placeholder="Nome" />
                {erros.nome_responsavel && <p style={{ color: 'red' }}>{erros.nome_responsavel}</p>}
              </div>

              <div>
              <img src="./img/usuario.png" alt="Usuário" width={18} />
                <input type="text" name="nome_fantasia" value={formData.nome_fantasia} onChange={handleInputChange} placeholder="Nome Fantasia" />
                {erros.nome_fantasia && <p style={{ color: 'red' }}>{erros.nome_fantasia}</p>}
              </div>

              <div>
              <img src="./img/12.png" alt="Usuário" width={18} />
                <input type="text" name="razao_social" value={formData.razao_social} onChange={handleInputChange} placeholder="Razão Social" />
                {erros.razao_social && <p style={{ color: 'red' }}>{erros.razao_social}</p>}
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
                <input type="text" name="cpf_responsavel" value={formData.cpf_responsavel} onChange={handleInputChange} placeholder="CPF" maxLength={14} />
                {erros.cpf_responsavel && <p style={{ color: 'red' }}>{erros.cpf_responsavel}</p>}
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

              <div>
                <img src="./img/cnpj.png" alt="CNPJ" width={18} />
                <input type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} placeholder="CNPJ" maxLength={18} />
                {erros.cnpj && <p style={{ color: 'red' }}>{erros.cnpj}</p>}
              </div>
            </div>
          </div>
          <button  type="submit" disabled={loading}>Cadastrar</button>
        </form>
        <p>Já possui conta? <br /> 
        <Link to="/" style={{color : '#E25401'}}>Faça seu Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;