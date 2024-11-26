import React, { useState, useEffect } from 'react';
import DetalhesVaga from '../components/DetalhesVaga.jsx';
import './App.css'; // Adicione estilos CSS específicos

const MainContent = () => {
    const [activeTab, setActiveTab] = useState('perto');
    const [anuncios, setAnuncios] = useState([]);
    const [trabalhosPendentes, setTrabalhosPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anuncioSelecionado, setAnuncioSelecionado] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem("id_cliente");
        if (id) {
            fetchData(id); // Buscar os anúncios
            fetchTrabalhosPendentes(id); // Buscar os trabalhos pendentes
        } else {
            console.error('ID do cliente não encontrado no localStorage');
        }
    }, []);

    // Função para buscar os dados de anúncios
    const fetchData = async (id) => {
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
            console.log('Dados de anúncios recebidos:', data);

            // Verifica se o campo bico é um array e define o estado
            setAnuncios(Array.isArray(data.bico) ? data.bico : []);
        } catch (error) {
            console.error('Erro ao buscar dados de anúncios:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar os dados de trabalhos pendentes
    const fetchTrabalhosPendentes = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/2.0/touccan/cliente/historico/${id}`);

            if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Dados de trabalhos pendentes recebidos:', data);

            // Verifica se o campo historico é um array e define o estado
            setTrabalhosPendentes(Array.isArray(data.historico) ? data.historico : []);
        } catch (error) {
            console.error('Erro ao buscar dados de trabalhos pendentes:', error);
        }
    };

    const handleTabChange = (tab) => setActiveTab(tab);
    const showDetalhesAnuncio = (anuncio) => setAnuncioSelecionado(anuncio);
    const fecharModal = () => setAnuncioSelecionado(null);

    const handleAvaliar = (anuncioId) => {
        console.log(`Avaliar trabalho/anúncio com ID: ${anuncioId}`);
    };

    const handleVerCandidatos = (anuncioId) => {
        console.log(`Ver candidatos para o anúncio com ID: ${anuncioId}`);
    };

    return (
        <div className="main-content">
            {/* Estado de carregamento */}
            <div className='carregar'>
                {loading ? <div className="custom-loader"></div> : <div></div>}
            </div>

            {/* Abas */}
            <div className="tabs">
                <button className={`tab-button ${activeTab === 'perto' ? 'active' : ''}`} onClick={() => handleTabChange('perto')}>
                    Meus anúncios
                </button>
                <button className={`tab-button ${activeTab === 'urgente' ? 'active' : ''}`} onClick={() => handleTabChange('urgente')}>
                    Trabalhos pendentes
                </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className={`tab-content ${activeTab === 'perto' ? 'active' : ''}`}>
                {anuncios.length > 0 ? (
                    anuncios.map((anuncio) => (
                        <div className="job-card" key={anuncio.id} onClick={() => showDetalhesAnuncio(anuncio)}>
                            <div className="job-info">
                                <h3 className="job-title">{anuncio.titulo}</h3>
                                <p className="job-description">{anuncio.descricao}</p>
                                <div className="job-timing">
                                    Local: {Array.isArray(anuncio.cliente) && anuncio.cliente.length > 0 ? anuncio.cliente[0].nome_fantasia : 'Não disponível'} <br />
                                    Horário: {new Date(anuncio.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(anuncio.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                                    Preço: R$ {anuncio.salario.toFixed(2)}
                                </div>
                                <p className="job-difficulty">
                                    <span>Dificuldade:</span> {Array.isArray(anuncio.dificuldade) && anuncio.dificuldade.length > 0 ? anuncio.dificuldade[0]?.dificuldade : 'Não especificada'}
                                </p>
                                {/* Botão para Ver Candidatos */}
                                <button className="btn-ver-candidatos" onClick={() => handleVerCandidatos(anuncio.id)}>
                                    Ver Candidatos
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum anúncio encontrado.</p>
                )}
            </div>

            <div className={`tab-content ${activeTab === 'urgente' ? 'active' : ''}`}>
                {trabalhosPendentes.length > 0 ? (
                    trabalhosPendentes.map((trabalho) => (
                        <div className="job-card" key={trabalho.id} onClick={() => showDetalhesAnuncio(trabalho)}>
                            <div className="job-info">

                                <h3 className="job-name">
                                    <img
                                        src={trabalho.foto && trabalho.foto !== "" ? trabalho.foto : "caminho/para/imagem-padrao.jpg"}
                                        alt={trabalho.nome}
                                        className="job-image"
                                    />
                                    <span className="job-person-name">{trabalho.nome}</span>
                                </h3>

                                <div className='job-title'>{trabalho.titulo}</div>

                                <div className='job-descricao'>{trabalho.descricao}</div>
                            
                                <div className="job-timing">
                                    Local: {Array.isArray(trabalho.cliente) && trabalho.cliente.length > 0 ? trabalho.cliente[0].nome_fantasia : 'Não disponível'} <br />
                                    Horário: {new Date(trabalho.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(trabalho.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                                    Preço: {typeof trabalho.salario === 'number' ? `R$ ${trabalho.salario.toFixed(2)}` : 'Não disponível'}
                                </div>

                                {/* Botão de Avaliar */}
                                <button className="btn-avaliar" onClick={() => handleAvaliar(trabalho.id)}>
                                    Avaliar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Sem trabalhos pendentes.</p>
                )}
            </div>

            {/* Modal para mostrar detalhes */}
            {anuncioSelecionado && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <DetalhesVaga anuncio={anuncioSelecionado} onClose={fecharModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainContent;
