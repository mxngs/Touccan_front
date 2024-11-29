import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from '../components/Sidebar.jsx';
import { AiOutlinePlus } from 'react-icons/ai';

const Perfil = () => {
  const [mudarTab, setMudarTab] = useState('sobre');
  const [dadosCliente, setDadosCliente] = useState(null);
  const [endereco, setEndereco] = useState('');
  const [anuncios, setAnuncios] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
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
          const endereco = cliente.endereco[0]
          setDadosCliente(cliente);
          setEmail(cliente.email);
          setTelefone(cliente.telefone);
          setEndereco(endereco);
          fetchAnuncios(id);
          fetchFeedbacks(id);
        }
      }
    } catch (error) {
      console.error('Erro na requisição da API:', error);
    }
  };

  const juntar = (feedback) => {
    const ava = feedback?.avaliacoes || [];
    const den = feedback?.denuncias || [];
    return [...ava, ...den];
  };

  const fetchFeedbacks = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/2.0/touccan/feedback/cliente/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Dados brutos recebidos da API:', data);
        const feedback = juntar(data);
        if (Array.isArray(feedback)) {
          setFeedbacks(feedback);
        } else {
          console.warn('A resposta da API não contém um array válido de feedbacks.');
          setFeedbacks([]);
        }
      } else {
        console.error('Erro ao buscar feedbacks:', response.statusText);
        setFeedbacks([]);
      }
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
      setFeedbacks([]);
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
      console.log(data);

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
                  value={endereco ? `Endereço: ${endereco.rua}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}` : 'Indefinido'}
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
          </div>
        )}

        <div className="extra-anuncios">
          {anuncios.length > 0 ? (
            anuncios.map((anuncio) => (
              <div className="job-card" key={`extra-${anuncio.id}`} onClick={() => showDetalhesAnuncio(anuncio)}>
                <div className="job-info">
                  <h3 className="job-title">{anuncio.titulo}</h3>
                  <p className="job-description">{anuncio.descricao}</p>
                  <div className="job-timing">
                    Local: {anuncio.cliente?.[0]?.nome_fantasia || 'Não disponível'} <br />
                    Horário: {new Date(anuncio.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(anuncio.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                    Preço: R$ {anuncio.salario.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum anúncio adicional encontrado.</p>
          )}
        </div>

        {mudarTab === 'feedback' && (
          <div id="feedback" className="tab-content">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <div className="feedback-card" key={index}>
                  {feedback.denuncia ? (
                    <p><strong>Denúncia:</strong> {feedback.denuncia}</p>
                  ) : (
                    <p><strong>Denúncia:</strong> Nenhuma denúncia registrada</p>
                  )}
                  {feedback.avaliacao ? (
                    <p><strong>Avaliação:</strong> {feedback.avaliacao}</p>
                  ) : (
                    <p><strong>Avaliação:</strong> Nenhuma avaliação registrada</p>
                  )}
                  <p><strong>Id Bico:</strong> {feedback.id_bico || 'Indefinido'}</p>
                  <p><strong>Id Cliente:</strong> {feedback.id_cliente || 'Indefinido'}</p>
                  <p><strong>Id Usuário:</strong> {feedback.id_usuario || 'Indefinido'}</p>
                </div>
              ))
            ) : (
              <p>Nenhum feedback encontrado. Verifique se há avaliações ou denúncias feitas por clientes.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
