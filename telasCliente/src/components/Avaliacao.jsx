import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Avaliacao.css';
import { Link } from 'react-router-dom';

//funcionando
const Avaliacao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trabalho, setTrabalho] = useState(null);
  const [comentario, setComentario] = useState(''); // Para a avaliação ou denúncia
  const [nota, setNota] = useState(1); // Para avaliação
  const [isDenuncia, setIsDenuncia] = useState(false); // Controle do tipo de ação (avaliação ou denúncia)
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
    if (!comentario.trim() || !nota) {
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
      avaliacao: comentario,
      nota: nota,
    };
    console.log(dadosAvaliacao);
    
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
      console.log(response);
      

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

  const handleEnviarDenuncia = async () => {
    if (!comentario.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo incompleto',
        text: 'Por favor, forneça uma descrição para a denúncia.',
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

    const dadosDenuncia = {
      id_usuario: parseInt(idUsuario),
      id_cliente: parseInt(idCliente),
      id_bico: parseInt(id),
      denuncia: comentario,
    };

    try {
      const response = await fetch('https://touccan-backend-8a78.onrender.com/2.0/touccan/denuncia/cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosDenuncia),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar denúncia');
      }

      Swal.fire({
        icon: 'success',
        title: 'Denúncia Enviada',
        text: 'Sua denúncia foi enviada com sucesso!',
      }).then(() => {
        navigate('/home');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível enviar a denúncia.',
      });
    }
  };

  const handleNotaClick = (valor) => {
    setNota(valor);
  };

  const handleToggleForm = () => {
    setIsDenuncia(!isDenuncia); // Alterna entre avaliação e denúncia
    setComentario(''); // Limpa o campo de texto ao alternar
  };

  return (
    <div className="fundooo">
      <div className="fundooo">
        <Link to="/home" className="botao-voltar">
          &lt;
        </Link>
      </div>
      <div className="detalhes-vaga">
        {loading ? (
          <div>Carregando...</div>
        ) : trabalho ? (
          <div>
            <h2>{isDenuncia ? 'Faça sua Denúncia' : 'Avalie o Trabalho'}: {trabalho.titulo}</h2>
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

            <div className="formulario">
              <div>
                <label>{isDenuncia ? 'Faça sua denúncia:' : 'Deixe seu comentário:'}</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder={isDenuncia ? 'Escreva sua denúncia...' : 'Escreva sua avaliação...'}
                />
              </div>

              {!isDenuncia ? (
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
              ) : null}

              <button onClick={isDenuncia ? handleEnviarDenuncia : handleEnviarAvaliacao}>
                {isDenuncia ? 'Enviar Denúncia' : 'Enviar Avaliação'}
              </button>

              <button onClick={handleToggleForm} className="toggle-button">
                {isDenuncia ? 'Cancelar Denúncia e Avaliar' : 'Denunciar'}
              </button>
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
