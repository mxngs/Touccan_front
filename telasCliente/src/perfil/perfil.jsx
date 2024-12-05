import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from '../components/Sidebar.jsx';
import { AiOutlinePlus } from 'react-icons/ai';
import Swal from 'sweetalert2';

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
    if (tab === 'feedback') {
      const id = localStorage.getItem("id_cliente");
      if (id) fetchFeedbacks(id);
    }
  };

  const fetchDadosCliente = async (id) => {
    try {
      const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/${id}`);
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
      const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/feedback/cliente/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Feedbacks recebidos:', data);
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
      const response = await fetch('https://touccan-backend-8a78.onrender.com/2.0/touccan/bico', {
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
  
    console.log('Payload being sent:', payload); 
  
    try {
      const response = await fetch(`http://localhost:8080/2.0/touccan/cliente/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const responseBody = await response.json(); 
      if (response.ok) {
        Swal.fire({
          title: 'Perfil atualizado com sucesso!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        setIsEditing(false);
      } else {
        // Exibindo o erro com SweetAlert2
        Swal.fire({
          title: 'Erro ao atualizar perfil!',
          text: responseBody.message || 'Houve um erro ao tentar salvar os dados.',
          icon: 'error',
          confirmButtonText: 'Tentar novamente',
        });
      }
    } catch (error) {
      console.error('Erro na requisição de atualização:', error);
      Swal.fire({
        title: 'Erro ao atualizar perfil!',
        text: 'Houve um problema ao tentar atualizar o perfil. Tente novamente mais tarde.',
        icon: 'error',
        confirmButtonText: 'Fechar',
      });
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

{mudarTab === 'feedback' && (
  <div id="feedback" className="tab-contentt">
    {feedbacks.length > 0 ? (
      <>
        {/* Calcular a avaliação geral e a porcentagem de denúncias */}
        {
          (() => {
            const totalNotas = feedbacks.reduce((acc, f) => acc + (f.nota || 0), 0);
            const mediaAvaliacoes = totalNotas / feedbacks.length;
            const estrelasGeral = mediaAvaliacoes ? Math.round(mediaAvaliacoes) : 0;

            const totalDenuncias = feedbacks.filter(f => f.denuncia).length;
            const porcentagemDenuncias = feedbacks.length > 0 ? (totalDenuncias / feedbacks.length) * 100 : 0;

            return (
              <div className="gerals">
                {/* Div para Avaliação Geral */}
                <div className="avaliacao-geral">
                  <p><strong>Avaliação Geral:</strong></p>
                  <div className="avaliacao-containerR">
                    <div className="estrelasS">
                      {/* Exibindo as estrelas da avaliação geral */}
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < estrelasGeral ? 'estrela-cheia' : 'estrela-vazia'}>★</span>
                      ))}
                    </div>
                    <p>{mediaAvaliacoes ? mediaAvaliacoes.toFixed(1) : '0'}</p>
                  </div>
                </div>

                {/* Div para Denúncia Geral */}
                <div className="denuncia-geral">
                  <p><strong>Denúncias:</strong></p>
                  <p>{totalDenuncias} de {feedbacks.length} feedbacks ({porcentagemDenuncias.toFixed(2)}%)</p>
                </div>
              </div>
            );
          })()
        }

        {/* Iterando pelos feedbacks individuais */}
        {feedbacks.map((feedback, index) => (
          <div className="" key={index}>
            <div className="avaliacao-especifica-container">
              <div className="avaliacao-especifica">
                {feedback.nota && (
                  <>
                    <p>{feedback.avaliacao}</p>
                    <div className="estrelas">
                      {/* Exibindo as estrelas com base na nota do feedback */}
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < feedback.nota ? 'estrela-cheia' : 'estrela-vazia'}>★</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Div para Denúncia Específica */}
            <div className="denuncia-especifica">
              {feedback.denuncia && (
                <div className="denuncia-card">{feedback.denuncia}
                  <img src="../img/denuncia.png" alt="Denúncia" className="denuncia-img" />
                </div>
              )}
            </div>
          </div>
        ))}
      </>
    ) : (
      <div className="semFeedbacks">
        <p>Você não tem feedbacks.</p>
      </div>
)}
</div>
        )}



        {/* Adicionar condição para exibir anúncios apenas quando a aba "sobre" estiver ativa */}
        {mudarTab === 'sobre' && (
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
              <div className="semAnuncios">
                <p>Você não tem anúncios</p> {/* Mensagem para quando não houver anúncios */}
              </div>
            )}
          </div>
        )}





      </div>
    </div>
  );
};

export default Perfil;
