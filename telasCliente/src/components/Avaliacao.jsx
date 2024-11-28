import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const Avaliacao = () => {
  const { id } = useParams();  // Captura o ID do trabalho a partir da URL
  const [trabalho, setTrabalho] = useState(null);
  const [avaliacao, setAvaliacao] = useState('');
  const [nota, setNota] = useState(1);  // Definindo um valor padrão para a nota (1)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar os dados do trabalho
    const fetchTrabalho = async () => {
      try {
        const response = await fetch(``);
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do trabalho');
        }
        const data = await response.json();
        if (data) {
          setTrabalho(data);  // Define os dados do trabalho no estado
        } else {
          throw new Error('Trabalho não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar trabalho:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar os dados do trabalho.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrabalho();
  }, [id]);  // Recarregar os dados sempre que o ID mudar

  // Função para enviar a avaliação
  const handleEnviarAvaliacao = async () => {
    // Validar campos
    if (!avaliacao.trim() || !nota) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, forneça uma avaliação e escolha uma nota.'
      });
      return;
    }
  
    const idUsuario = localStorage.getItem('id_usuario');
    const idCliente = localStorage.getItem('id_cliente');
    
    if (!idUsuario || !idCliente) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Usuário ou cliente não encontrado.'
      });
      return;
    }
  
    const dadosAvaliacao = {
      id_usuario: parseInt(idUsuario),  // Convertendo para número
      id_cliente: parseInt(idCliente),  // Convertendo para número
      id_bico: parseInt(id),           // ID do trabalho (bico)
      avaliacao: avaliacao,
      nota: nota,
    };
  
    try {
      const response = await fetch('http://localhost:8080/2.0/touccan/avaliacao/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAvaliacao),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao enviar avaliação');
      }
  
      Swal.fire({
        icon: 'success',
        title: 'Avaliação Enviada',
        text: 'Sua avaliação foi enviada com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível enviar a avaliação.'
      });
    }
  };
  
  return (
    <div className="avaliar-trabalho">
      {loading ? (
        <div>Carregando...</div>
      ) : trabalho ? (
        <div>
          <h2>Avalie o Trabalho: {trabalho.titulo}</h2>
  
          <div className="job-info">
            <h3 className="job-name">
              <img
                src={trabalho.foto && trabalho.foto !== "" ? trabalho.foto : "/img/semFtoo.jpg"} // Foto padrão
                alt={trabalho.nome}
                className="job-image"
              />
              <span className="job-person-name">{trabalho.nome}</span>
            </h3>
  
            <div className="job-title">{trabalho.titulo}</div>
            <div className="job-descricao">{trabalho.descricao}</div>
  
            <div className="job-timing">
              Local: {Array.isArray(trabalho.cliente) && trabalho.cliente.length > 0 ? trabalho.cliente[0].nome_fantasia : 'Não disponível'} <br />
              Horário: {new Date(trabalho.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(trabalho.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
              Preço: {typeof trabalho.salario === 'number' ? `R$ ${trabalho.salario.toFixed(2)}` : 'Não disponível'}
            </div>
          </div>
  
          {/* Formulário de Avaliação */}
          <div className="avaliacao-form">
            <div>
              <label>Avaliação:</label>
              <textarea
                value={avaliacao}
                onChange={(e) => setAvaliacao(e.target.value)}
                placeholder="Escreva sua avaliação..."
              />
            </div>
  
            <div>
              <label>Nota:</label>
              <select value={nota} onChange={(e) => setNota(parseInt(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
  
            <button onClick={handleEnviarAvaliacao}>Enviar Avaliação</button>
          </div>
        </div>
      ) : (
        <p>Trabalho não encontrado.</p>
      )}
    </div>
  );
};

export default Avaliacao;
