import React, { useState, useEffect } from 'react';

const MainContent = () => {
    const [activeTab, setActiveTab] = useState('perto');
    const [anuncios, setAnuncios] = useState([]);
    const [trabalhosPendentes, setTrabalhosPendentes] = useState([]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Função para buscar anúncios e trabalhos pendentes
    const fetchData = async () => {
        try {
            const responseAnuncios = await fetch('http://localhost:8080/2.0/touccan/bico/'); 
            const dataAnuncios = await responseAnuncios.json();
            setAnuncios(dataAnuncios);

            const responseTrabalhos = await fetch('http://localhost:8080/'); 
            const dataTrabalhos = await responseTrabalhos.json();
            setTrabalhosPendentes(dataTrabalhos);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

            <div className={`tab-content ${activeTab === 'perto' ? 'active' : ''}`} id="perto">
                {anuncios.map(anuncio => (
                    <div className="job-card" key={anuncio.id}>
                        <div className="job-info">
                            <h3 className="job-title">{anuncio.titulo}</h3>
                            <p className="job-description">{anuncio.descricao}</p>

                            <p className="job-timing">
                                Local: {anuncio.cliente[0]?.nome_fantasia || 'Localização não disponível'} <br />
                                Horário: {new Date(anuncio.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(anuncio.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                                Preço: R$ {anuncio.salario.toFixed(2)}
                            </p>
                            <p className="job-difficulty">
                                <span>Dificuldade:</span> <span>{anuncio.dificuldade[0]?.dificuldade || 'não especificada'}</span>
                            </p>
                            <button className="register-btn">Ver candidatos</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`tab-content ${activeTab === 'urgente' ? 'active' : ''}`} id="urgente">
                {trabalhosPendentes.length > 0 ? (
                    trabalhosPendentes.map(trabalho => (
                        <div className="job-card" key={trabalho.id}>
                            <h3>{trabalho.titulo}</h3>
                            <p>{trabalho.descricao}</p>
                        </div>
                    ))
                ) : (
                    <p>Sem trabalhos pendentes.</p>
                )}
            </div>
        </div>
    );
};

export default MainContent;
