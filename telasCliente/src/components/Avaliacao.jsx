import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Avaliacao.css';
import { Link } from 'react-router-dom';

const Avaliacao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trabalho, setTrabalho] = useState(null);
  const [avaliacao, setAvaliacao] = useState('');
  const [nota, setNota] = useState(1);
  const [loading, setLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const fetchTrabalho = async () => {
      try {
        const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/bico/historico/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do trabalho');
        }
        const data = await response.json();
        if (data && data.bicos && data.bicos.length > 0) {
          let separar = data.bicos[0];
          setTrabalho(separar);
          setIdUsuario(separar.id_usuario);
        } else {
          throw new Error('Trabalho não encontrado');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar os dados do trabalho.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrabalho();
  }, [id]);

  const handleEnviarAvaliacao = async () => {
    if (!avaliacao.trim() || !nota) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, forneça uma avaliação e escolha uma nota.',
      });
      return;
    }

    if (!idUsuario) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Usuário não encontrado.',
      });
      return;
    }

    const idCliente = localStorage.getItem('id_cliente');

    if (!idCliente) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Cliente não encontrado.',
      });
      return;
    }

    const dadosAvaliacao = {
      id_usuario: parseInt(idUsuario),
      id_cliente: parseInt(idCliente),
      id_bico: parseInt(id),
      avaliacao: avaliacao,
      nota: nota,
    };

    try {
      const response = await fetch('https://touccan-backend-8a78.onrender.com/2.0/touccan/avaliacao/cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAvaliacao),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar avaliação');
      }

      Swal.fire({
        icon: 'success',
        title: 'Avaliação Enviada',
        text: 'Sua avaliação foi enviada com sucesso!',
      }).then(() => {
        navigate('/home');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível enviar a avaliação.',
      });
    }
  };

  const handleNotaClick = (valor) => {
    setNota(valor);
  };

  return (
    <div className="fundooo">
      <div className="fundooo">
        <Link to="/home" className="botao-voltar">
          &lt;
        </Link>
        <div className="detalhes-vaga"></div>
      </div>
      <div className="detalhes-vaga">
        {loading ? (
          <div>Carregando...</div>
        ) : trabalho ? (
          <div>
            <h2>Avalie o Trabalho: {trabalho.titulo}</h2>
            <div className="job-info">
              <h3 className="job-name">
                <img
                  src={trabalho.foto ? trabalho.foto : '/img/semFtoo.jpg'}
                  alt={trabalho.nome || 'Imagem do trabalho'}
                  className="job-image"
                />
                <span className="job-person-name">{trabalho.nome || 'Nome não disponível'}</span>
              </h3>
              <div className="job-title">{trabalho.titulo || 'Título não disponível'}</div>
              <div className="job-timing">
                Início: {new Date(trabalho.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                <br />
                Término: {new Date(trabalho.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                <br />
                Pagamento:{' '}
                {typeof trabalho.salario === 'number' ? `R$ ${trabalho.salario.toFixed(2)}` : 'Não disponível'}
              </div>
            </div>

            <div className="avaliacao-form">
              <div>
                <label>Deixe seu comentario:</label>
                <textarea
                  value={avaliacao}
                  onChange={(e) => setAvaliacao(e.target.value)}
                  placeholder="Escreva sua avaliação..."
                />
              </div>

              <div>
                <label>Avalie o trabalho:</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((valor) => (
                    <span
                      key={valor}
                      style={{ cursor: 'pointer', fontSize: '30px', color: valor <= nota ? 'gold' : 'gray' }}
                      onClick={() => handleNotaClick(valor)}
                    >
                      {valor <= nota ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>

              <button onClick={handleEnviarAvaliacao}>Enviar Avaliação</button>
            </div>
          </div>
        ) : (
          <p>Trabalho não encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Avaliacao;
