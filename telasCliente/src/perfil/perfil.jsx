import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from '../components/Sidebar.jsx';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const [mudarTab, setMudarTab] = useState('sobre');
  const [dadosCliente, setDadosCliente] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [anuncios, setAnuncios] = useState([]);

  const handleTabChange = (tab) => {
    setMudarTab(tab);
  };

  // Função para buscar os dados do cliente pela API
  const fetchDadosCliente = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/2.0/touccan/cliente/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Resposta da API:", data);

        if (data && data.cliente) {
          const cliente = data.cliente;
          setDadosCliente(cliente);
          fetchEndereco(cliente.cep);  // Busca o endereço usando o CEP
          fetchAnuncios(id); // Busca os anúncios do cliente
        } else {
          console.error('Dados do cliente não encontrados');
        }
      } else {
        console.error('Erro ao buscar dados do cliente, resposta não OK');
      }
    } catch (error) {
      console.error('Erro na requisição da API:', error);
    }
  };

  // Função para buscar o endereço completo usando a API ViaCEP
  const fetchEndereco = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.ok) {
        const enderecoData = await response.json();
        setEndereco(enderecoData);
      } else {
        console.error('Erro ao buscar o endereço');
      }
    } catch (error) {
      console.error('Erro na requisição do endereço:', error);
    }
  };

  // Função para buscar anúncios do cliente
  const fetchAnuncios = async (id) => {
    try {
      const response = await fetch('http://localhost:8080/2.0/touccan/bico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cliente: id }),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Anúncios recebidos:', data);
      setAnuncios(data.bico || []);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id_cliente");
    if (id) fetchDadosCliente(id);
    else console.error('ID do cliente não encontrado no localStorage');
  }, []);

  return (
    <div className='tela-perfil-cliente'>
      <Sidebar/>
      <div className="infos-perfil-cliente">
        <div className="pfp-perfil-cliente">
          <img src="../img/store.png" alt="" />
        </div>
        
        {/* Nome Fantasia da empresa */}
        <span className='nome-perfil-cliente'>
          {dadosCliente ? dadosCliente.nome_fantasia : 'Carregando...'}
        </span>

        <div className="tabs">
          <button
            className={`tab-button ${mudarTab === 'sobre' ? 'active' : ''}`}
            onClick={() => handleTabChange('sobre')}
          >
            Sobre Nós
          </button>
          <button
            className={`tab-button ${mudarTab === 'feedback' ? 'active' : ''}`}
            onClick={() => handleTabChange('feedback')}
          >
            Feedback
          </button>
        </div>

        {mudarTab === 'sobre' && (
          <div className="tab-content" id='sobre-perfil-cliente'>
            <button>Editar Perfil</button>

            <div className="inputs-perfil-cliente">
              <div className="endereco-perfil-cliente">
                <input 
                  type="text" 
                  disabled 
                  value={endereco ? `Endereço: ${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}` : 'Carregando endereço...'}
                />
              </div>

              <div className="foto-perfil-cliente">
                <input type="text" disabled value="Imagens da Localização: "/>
              </div>

              <div className="contatos-perfil-cliente">
                <input 
                  type="text" 
                  disabled 
                  value={dadosCliente ? `Contatos: ${dadosCliente.email} / ${dadosCliente.telefone}` : 'Carregando contatos...'} 
                />
              </div>
            </div>

            {/* Exibição dos anúncios */}
            <div className="anuncios-perfil-cliente">
              <span>Anúncios</span>
              {anuncios.length > 0 ? (
                anuncios.map((anuncio) => (
                  <div className="job-card" key={anuncio.id}>
                    <h3>{anuncio.titulo}</h3>
                    <p>{anuncio.descricao}</p>
                    <p>Local: {anuncio.cliente?.nome_fantasia || 'Não disponível'}</p>
                    <p>Preço: R$ {anuncio.salario.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p>Nenhum anúncio encontrado.</p>
              )}
            </div>
          </div>
        )}

        {mudarTab === 'feedback' && (
          <div className="tab-content" id='feedback-perfil-cliente'>
            <div className="teste-perfil-cliente">
              <span>funciona funciona funciona funciona</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil;
