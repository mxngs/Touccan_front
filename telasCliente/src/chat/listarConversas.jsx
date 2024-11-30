import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListaConversas = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState(null);

  const fetchUsuarios = async (id_cliente) => {
    try {
      const response = await fetch(`http://localhost:8080/2.0/touccan/cliente/relacoes/${id_cliente}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.status_code === 200 && Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
      } else {
        setUsuarios([]);
        console.log('Sem usuários disponíveis');
      }
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error);
      setErro('Houve um problema ao buscar os usuários. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id_cliente");
    if (id) {
      fetchUsuarios(id);
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

      <input type="text" className="barra-pesquisa" placeholder="Pesquisar usuário" />
      <div className="linha-laranja"></div>
      <div className="linha-preta"></div>

      <div className="conversas">
  {usuarios.length > 0 ? (
    usuarios.map(({ id_usuario, nome_usuario, foto_usuario }, index) => (
      <Link to={`/chat/${id_usuario}`} key={`${id_usuario}-${index}`} className="conversa">
        <img src={foto_usuario} alt="Profile" className="icon-conversa" />
        <div className="nome-conversa">{nome_usuario}</div>
        <div className="hora-conversa">10:30</div>
      </Link>
    ))
  ) : (
    <p>Sem usuários disponíveis.</p>
  )}
</div>

    </div>
  );
};

export default ListaConversas;
