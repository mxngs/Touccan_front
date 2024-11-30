import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListaConversas = () => {
  const [conversas, setConversas] = useState({});
  const [erro, setErro] = useState(null);

  const fetchConversas = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/2.0/touccan/cliente/relacoes/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar conversas: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.status === true && typeof data.conversas === 'object') {
        setConversas(data.conversas);
      } else {
        setConversas({}); // 
        console.log('Sem conversas disponíveis');
      }
    } catch (error) {
      console.error('Erro ao buscar as conversas:', error);
      setErro('Houve um problema ao buscar as conversas. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id_cliente");
    if (id) {
      fetchConversas(id); 
    } else {
      setErro('ID do cliente não encontrado no localStorage');
      console.error('ID do cliente não encontrado no localStorage');
    }
  }, []);

  if (erro) {
    return <p>{erro}</p>;
  }

  return (
    <div className="area-central">
    
      <div className="menu-lateral">
        <Link to="/home" className="btn-voltar">  
          &#8592; Voltar
        </Link>
      </div>

    
      <input type="text" className="barra-pesquisa" placeholder="Pesquisar conversa" />
      <div className="linha-laranja"></div>
      <div className="linha-preta"></div>

      <div className="conversas">
        {Object.keys(conversas).length > 0 ? (
          Object.keys(conversas).map((id) => {
            const conversa = conversas[id] && conversas[id][0]; // Acessa a primeira conversa, se existir
            if (!conversa) return null; // Se não houver dados, retorna null
            const { nome, texto } = conversa;
            
            return (
              <Link to={`/chat/${id}`} key={id} className="conversa">
                <img src="./Imagem - Perfil.png" alt="Profile" className="icon-conversa" />
                <div className="nome-conversa">{nome}</div>
                <div className="mensagem-conversa">{texto}</div>
                <div className="hora-conversa">10:30</div>
              </Link>
            );
          })
        ) : (
          <p>Sem conversas disponíveis.</p>
        )}
      </div>
    </div>
  );
};

export default ListaConversas;
