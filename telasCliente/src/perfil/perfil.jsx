import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from '../components/Sidebar.jsx';
import { AiOutlinePlus } from 'react-icons/ai';

const Perfil = () => {
  const [mudarTab, setMudarTab] = useState('sobre');
  const [dadosCliente, setDadosCliente] = useState(null);
  const [endereco, setEndereco] = useState(null); // Inicialize como null
  const [anuncios, setAnuncios] = useState([]);
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleTabChange = (tab) => {
    setMudarTab(tab);
  };

  const fetchDadosCliente = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/2.0/touccan/cliente/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.cliente) {
          const cliente = data.cliente;
          setDadosCliente(cliente);
          setEmail(cliente.email);
          setTelefone(cliente.telefone);
          fetchEndereco(cliente.cep); // Tenta buscar o endereço
          fetchAnuncios(id);
        }
      }
    } catch (error) {
      console.error('Erro na requisição da API:', error);
    }
  };

  // Função para buscar o endereço
  const fetchEndereco = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        throw new Error('Erro ao acessar o ViaCEP');
      }

      const enderecoData = await response.json();
      if (enderecoData.erro) {
        throw new Error('CEP inválido');
      }

      setEndereco(enderecoData);
    } catch (error) {
      console.error('Erro ao obter o endereço:', error.message);
      setEndereco(undefined); // Em caso de erro, setar como undefined
    }
  };

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
      setAnuncios(data.bico || []);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id_cliente");
    if (id) fetchDadosCliente(id);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const id = localStorage.getItem("id_cliente");
    if (!id) {
      console.error('ID do cliente não encontrado no localStorage');
      return;
    }
    let fotoURL = dadosCliente.foto;
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'profile_pics');
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dauesfz5t/image/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        fotoURL = result.secure_url; 
        await saveClienteData(id, fotoURL); 
        setDadosCliente((prev) => ({ ...prev, foto: fotoURL }));
      } catch (error) {
        console.error('Erro ao carregar a foto para o Cloudinary:', error);
        alert('Erro ao carregar a foto, tente novamente.');
      }
    } else {
      await saveClienteData(id, fotoURL); 
    }
  };

  const saveClienteData = async (id, fotoURL) => {
    const payload = {
      id: dadosCliente.id,
      nome_responsavel: dadosCliente.nome_responsavel,
      cpf_responsavel: dadosCliente.cpf_responsavel,
      email,
      nome_fantasia: dadosCliente.nome_fantasia,
      razao_social: dadosCliente.razao_social,
      telefone,
      cnpj: dadosCliente.cnpj,
      cep: dadosCliente.cep,
      senha: dadosCliente.senha,
      premium: dadosCliente.premium,
      foto: fotoURL  
    };

    try {
      const response = await fetch(`http://localhost:8080/2.0/touccan/cliente/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Dados atualizados com sucesso');
        setIsEditing(false); 
      } else {
        const errorText = await response.text();
        console.error('Erro ao atualizar dados:', response.statusText, errorText);
        alert('Erro ao salvar os dados. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição de atualização:', error);
      alert('Erro na atualização. Tente novamente.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="tela-perfil-cliente">
      <Sidebar />
      <div className="infos-perfil-cliente">
        {isEditing && (
          <div className="AdcFoto">
            <label htmlFor="upload-image" className="upload-icon">
              <AiOutlinePlus size={24} /> Alterar Foto de Perfil
            </label>
            <input
              type="file"
              id="upload-image"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
        )}

        <div className="pfp-perfil-cliente">
          {dadosCliente ? (
            dadosCliente.foto ? (
              <img src={dadosCliente.foto} alt="Foto do Cliente" />
            ) : (
              <img src="../img/semFtoo.png" alt="Sem Foto de Perfil" />
            )
          ) : 'Carregando...'}
        </div>

        <span className="nome-perfil-cliente">
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
          <div className="tab-content" id="sobre-perfil-cliente">
            <button onClick={isEditing ? handleSave : handleEdit}>
              {isEditing ? 'Salvar' : 'Editar'}
            </button>

            <div className="inputs-perfil-cliente">
              <div className="endereco-perfil-cliente">
                <input
                  type="text"
                  disabled
                  value={endereco ? `Endereço: ${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}` : 'Indefinido'}
                />
              </div>

              <div className="contatos-perfil-cliente">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  disabled={!isEditing}
                />
              </div>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Telefone"
                disabled={!isEditing}
              />
            </div>

            <div className="anuncios-perfil-cliente">
              <span>Anúncios</span>
              {anuncios.length > 0 ? (
                anuncios.map((anuncio) => (
                  <div className="job-card-perfil" key={anuncio.id}>
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
          <div className="tab-content" id="feedback-perfil-cliente">
            <div className="teste-perfil-cliente">
              <span>funciona funciona funciona funciona</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
