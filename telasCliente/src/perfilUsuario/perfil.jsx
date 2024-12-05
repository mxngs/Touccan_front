import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';
import Sidebar from '../components/Sidebar.jsx';

//funcionando
const PerfilUsuario = () => {
  const { id } = useParams();
  const [mudarTab, setMudarTab] = useState('sobre');
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [mediaNotas, setMediaNotas] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchDadosUsuario(id);
    fetchFeedbacks(id);
  }, [id]);

  const fetchDadosUsuario = async (id) => {
    try {
      const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/usuario/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.usuario) {
          setDadosUsuario(data.usuario);
        }
      }
    } catch (error) {
      console.error('Erro na requisição da API:', error);
    }
  };

  const fetchFeedbacks = async (id) => {
    try {
      const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/feedback/usuario/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.avaliacoes && Array.isArray(data.avaliacoes)) {
          setFeedbacks(data.avaliacoes);
          calcularMediaNotas(data.avaliacoes);
        } else {
          setFeedbacks([]);
          setMediaNotas(null);
        }
      } else {
        console.error('Erro ao buscar feedbacks:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
      setFeedbacks([]);
      setMediaNotas(null);
    }
  };

  const calcularMediaNotas = (avaliacoes) => {
    const notasValidas = avaliacoes
      .filter((feedback) => feedback.nota !== null && feedback.nota !== undefined)
      .map((feedback) => feedback.nota);
    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, nota) => acc + nota, 0);
      setMediaNotas((soma / notasValidas.length).toFixed(2));
    } else {
      setMediaNotas(null);
    }
  };

  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  return (
    <div className="tela-perfil-user">
      <Sidebar />
      <div className="infos-perfil-user">
        <div className="pfp-perfil-usuario">
          {dadosUsuario ? (
            dadosUsuario.foto ? (
              <img src={dadosUsuario.foto} alt="Foto do Usuário" />
            ) : (
              <img src="../img/semFtoo.png" alt="Sem Foto de Perfil" />
            )
          ) : 'Carregando...'}
        </div>

        <span className="nome-perfil-usuario">
          {dadosUsuario ? `${dadosUsuario.nome}, ${calcularIdade(dadosUsuario.dataNascimento)}` : 'Carregando...'}
        </span>
        <span className="email-perfil-usuario">
          {dadosUsuario ? dadosUsuario.email : 'Carregando...'}
        </span>

        <div className="tabs">
          <button
            className={`tab-button ${mudarTab === 'sobre' ? 'active' : ''}`}
            onClick={() => setMudarTab('sobre')}
          >
            Sobre mim
          </button>
          <button
            className={`tab-button ${mudarTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setMudarTab('feedback')}
          >
            Feedback
          </button>
        </div>

        {mudarTab === 'sobre' && (
          <div className="inputs-perfil-user">
            <div>
              <label>Formação:</label>
              <input
                type="text"
                disabled
                value={dadosUsuario?.formacao || ''}
              />
            </div>

            <div>
              <label>Biografia:</label>
              <input
                type="text"
                disabled
                value={dadosUsuario?.biografia || ''}
              />
            </div>

            <div>
              <label>Habilidades:</label>
              <input
                type="text"
                disabled
                value={dadosUsuario?.habilidades || ''}
              />
            </div>

            <div>
              <label>Disponibilidade:</label>
              <input
                type="text"
                disabled
                value={dadosUsuario?.disponibilidade || ''}
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
      </div>
    </div>
  );
};

export default PerfilUsuario;
