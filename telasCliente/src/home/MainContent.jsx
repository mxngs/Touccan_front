import React, { useState, useEffect } from 'react';
import DetalhesVaga from '../components/DetalhesVaga.jsx';
import './App.css'; // Adicione estilos CSS específicos

const MainContent = () => {
    const [activeTab, setActiveTab] = useState('perto');
    const [anuncios, setAnuncios] = useState([]);
    const [trabalhosPendentes, setTrabalhosPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anuncioSelecionado, setAnuncioSelecionado] = useState(null); // Estado para o anúncio clicado

    useEffect(() => {
        const id = localStorage.getItem("id_cliente");
        if (id) fetchData(id);
        else console.error('ID do cliente não encontrado no localStorage');
    }, []);
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
            console.log('Dados recebidos:', data); 
            setAnuncios(data.bico || []);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleTabChange = (tab) => setActiveTab(tab);

    const showDetalhesAnuncio = (anuncio) => setAnuncioSelecionado(anuncio); 
    const fecharModal = () => setAnuncioSelecionado(null); 

    <div className='carregar'>
        {loading ? <div className="custom-loader"></div> : <div>Your content here</div>}
    </div>
       
    return (
        <div className="main-content">
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'perto' ? 'active' : ''}`}
                    onClick={() => handleTabChange('perto')}
                >
                    Meus anúncios
                </button>
                <button
                    className={`tab-button ${activeTab === 'urgente' ? 'active' : ''}`}
                    onClick={() => handleTabChange('urgente')}
                >
                    Trabalhos pendentes
                </button>
            </div>

            <div className={`tab-content ${activeTab === 'perto' ? 'active' : ''}`}>
                {anuncios.length > 0 ? (
                    anuncios.map((anuncio) => (
                        <div
                            className="job-card"
                            key={anuncio.id}
                            onClick={() => showDetalhesAnuncio(anuncio)}
                        >
                            <div className="job-info">
                                <h3 className="job-title">{anuncio.titulo}</h3>
                                <p className="job-description">{anuncio.descricao}</p>
                                <div className="job-timing">
                                    Local: {anuncio.cliente?.[0]?.nome_fantasia || 'Não disponível'} <br />
                                    Horário: {new Date(anuncio.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(anuncio.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                                    Preço: R$ {anuncio.salario.toFixed(2)}
                                </div>
                                <p className="job-difficulty">
                                    <span>Dificuldade:</span> {anuncio.dificuldade[0]?.dificuldade || 'Não especificada'}
                                </p>
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
                        <div className="job-card" key={trabalho.id}>
                            <h3>{trabalho.titulo}</h3>
                            <p>{trabalho.descricao}</p>
                        </div>
                    ))
                ) : (
                    <p>Sem trabalhos pendentes.</p>
                )}
            </div>

            {anuncioSelecionado && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <DetalhesVaga anuncio={anuncioSelecionado} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainContent;
