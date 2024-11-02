import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import './App.css';

const Candidatos = () => {
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [candidatosAceitos, setCandidatosAceitos] = useState(new Set());

    useEffect(() => {
        const fetchCandidatos = async () => {
            try {
                const response = await fetch('http://localhost:8080/2.0/touccan/candidato');
                if (!response.ok) throw new Error('Erro ao buscar candidatos');

                const data = await response.json();
                console.log("Dados recebidos da API:", data);

                if (Array.isArray(data.candidatos)) {
                    console.log("Candidatos:", data.candidatos);
                    setCandidatos(data.candidatos);
                    // Atualiza os candidatos aceitos baseado nos dados da API
                    const aceitos = new Set(data.candidatos.filter(candidato => candidato.escolhido).map(candidato => candidato.id_candidato));
                    setCandidatosAceitos(aceitos);
                } else {
                    console.error("A estrutura de dados não contém candidatos.");
                }
            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidatos();
    }, []);

    const aceitarCandidato = async (id_candidato, id_bico) => {
        if (!id_candidato || !id_bico) {
            console.error(`Tentativa de aceitar candidato com dados inválidos: id_candidato=${id_candidato}, id_bico=${id_bico}`);
            return;
        }
    
        const requestBody = { id_user: id_candidato, id_bico, escolhido: true };
        console.log("Requisição PUT:", requestBody);
    
        try {
            const response = await fetch(`http://localhost:8080/2.0/touccan/candidato`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao aceitar candidato: ${errorText}`);
            }
    
            // Atualiza o estado local para incluir o candidato aceito
            setCandidatos(prev =>
                prev.map(candidato =>
                    candidato.id_candidato === id_candidato ? { ...candidato, escolhido: true } : candidato
                )
            );
    
            // Atualiza o estado de candidatos aceitos
            setCandidatosAceitos(prev => new Set(prev).add(id_candidato));
    
            console.log(`Candidato aceito: ${id_candidato}`);
        } catch (error) {
            console.error("Erro ao aceitar candidato:", error);
        }
    };
    
    const negarCandidato = async (id_candidato, id_bico) => {
        // Verifica se os IDs são válidos antes de enviar a requisição
        if (!id_candidato || !id_bico) {
            console.error(`Tentativa de negar candidato com dados inválidos: id_candidato=${id_candidato}, id_bico=${id_bico}`);
            return;  // Evitar chamada se os IDs não forem válidos
        }
    
        console.log(`Tentando negar candidato: id_candidato=${id_candidato}, id_bico=${id_bico}`);
    
        // O corpo deve ser um objeto com os parâmetros id_user e id_bico
        const requestBody = { id_user: id_candidato, id_bico: id_bico };
    
        try {
            const response = await fetch(`http://localhost:8080/2.0/touccan/candidato`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),  // Enviando o corpo na requisição
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao negar candidato: ${errorText}`);
            }
    
            // Atualiza a lista de candidatos, removendo o candidato negado
            setCandidatos(prev => prev.filter(candidato => candidato.id_candidato !== id_candidato));
    
            // Remove do conjunto de aceitos
            setCandidatosAceitos(prev => {
                const newSet = new Set(prev);
                newSet.delete(id_candidato);
                return newSet;
            });
    
            console.log(`Candidato negado: ${id_candidato}`);
        } catch (error) {
            console.error("Erro ao negar candidato:", error);
        }
    };
    
    

    return (
        <div className="container">
            <Sidebar />

            <div className="content">
                <div className="title">Candidatos</div>
                <div className="title-line"></div>

                {loading ? (
                    <p>Carregando candidatos...</p>
                ) : (
                    candidatos.length > 0 ? (
                        candidatos.map((candidato, index) => (
                            <div className="candidate-box" key={`${candidato.id_candidato}-${candidato.id_bico}-${index}`}>
                                <img src={candidato.foto || 'default-image-url.jpg'} alt="Foto de Perfil" />
                                <div className="candidate-name">{candidato.candidato || 'Candidato Indefinido'}</div>

                                {/* Verifica se o candidato já foi aceito */}
                                {candidato.escolhido ? (
                                    <div style={{ color: 'green' }}>Contratado</div>
                                ) : (
                                    <>
                                        <button className="button button-aceitar" onClick={() => {
                                            console.log(`Aceitando candidato: ${candidato.candidato} com ID: ${candidato.id_candidato}`);
                                            aceitarCandidato(candidato.id_candidato, candidato.id_bico);
                                        }}>
                                            <span className="icon">✔️</span>
                                        </button>
                                        <button className="button button-negar" onClick={() => negarCandidato(candidato.id_candidato, candidato.id_bico)}>
                                            <span className="icon">❌</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Não há candidatos disponíveis.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default Candidatos;
