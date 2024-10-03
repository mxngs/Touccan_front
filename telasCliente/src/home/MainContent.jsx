import React, { useState, useEffect } from 'react';

const MainContent = () => {
    const [activeTab, setActiveTab] = useState('perto');
    const [anuncios, setAnuncios] = useState([]);
    const [trabalhosPendentes, setTrabalhosPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nome, setNome] = useState('');

    // Mover a lógica de setNome para um useEffect
    useEffect(() => {
        setNome('oiiiii'); // Atualiza o nome apenas uma vez
        console.log(nome); // Deve mostrar 'oiiiii' uma vez
    }, []); // Passando o array vazio, para que isso aconteça apenas uma vez

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const id = localStorage.getItem("id_cliente");
        console.log('ID recuperado:', id);  // Verifique o id do cliente

        if (id) {
            fetchData(id);
        } else {
            console.error('ID do cliente não encontrado no localStorage');
        }
    }, []); // Esse efeito ocorre apenas uma vez na montagem do componente

    const fetchData = async (id) => {
        try {
            console.log('ID do cliente:', id);

            let jsonEnviar = { id_cliente: id };
            const responseAnuncios = await fetch('http://localhost:8080/2.0/touccan/bico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonEnviar),
            });

            const dataAnuncios = await responseAnuncios.json();
            console.log('Resposta da API:', dataAnuncios);

            // Se os dados de "bico" não estiverem vazios, atualize o estado "anuncios"
            if (dataAnuncios && dataAnuncios.bico && dataAnuncios.bico.length > 0) {
                setAnuncios(dataAnuncios.bico);  // Atualizando o estado "anuncios"
                console.log(anuncios);
            } else {
                setAnuncios([]);  // Caso não haja dados, limpe o estado
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
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
                    <h2>perto</h2>
                </div>
                <div className={`tab-content ${activeTab === 'urgente' ? 'active' : ''}`} id="urgente">
                    <h2>urgente</h2>
                </div>
                <div>Carregando...</div>
            </div>
        );
    }

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
                {anuncios.length > 0 ? (
                    anuncios.map(anuncio => (
                        <div className="job-card" key={anuncio.id}>
                            <div className="job-info">
                                <h3 className="job-title">{anuncio.titulo}</h3>
                                <p className="job-description">{anuncio.descricao}</p>

                                <div className="job-timing">
                                    Local: {anuncio.cliente?.[0]?.nome_fantasia || 'Localização não disponível'} <br />
                                    Horário: {new Date(anuncio.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(anuncio.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                                    Preço: R$ {anuncio.salario.toFixed(2)}
                                </div>

                                <p className="job-difficulty">
                                    <span>Dificuldade:</span> <span>{anuncio.dificuldade[0]?.dificuldade || 'não especificada'}</span>
                                </p>
                                <div className="verCandidatos">
                                <button className="register-btn">Ver candidatos</button>
                                </div>
                               
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum anúncio encontrado.</p>
                )}
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
