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
        try {
            const response = await fetch(`http://localhost:8080/2.0/touccan/candidato`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_candidato, escolhido: true }),
            });

            if (!response.ok) throw new Error('Erro ao aceitar candidato');

            setCandidatosAceitos(prev => new Set(prev).add(id_candidato));
            setCandidatos(prev =>
                prev.map(candidato =>
                    candidato.id_candidato === id_candidato ? { ...candidato, escolhido: true } : candidato
                )
            );

            console.log(`Candidato aceito: ${id_candidato}`);
        } catch (error) {
            console.error("Erro ao aceitar candidato:", error);
        }
    };

    const negarCandidato = async (id_candidato, id_bico) => {
        console.log(`Candidato negado: ${id_candidato}`);

        try {
            const response = await fetch(`http://localhost:8080/2.0/touccan/candidato`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_candidato, id_bico }),
            });

            if (!response.ok) throw new Error('Erro ao negar candidato');

            setCandidatos(candidatos.filter(candidato => candidato.id_candidato !== id_candidato));
            setCandidatosAceitos(prev => {
                const newSet = new Set(prev);
                newSet.delete(id_candidato);
                return newSet;
            });
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
                        candidatos.map(candidato => (
                            <div className="candidate-box" key={candidato.id_candidato}>
                                <img src={candidato.foto} alt="Foto de Perfil" />
                                <div className="candidate-name">{candidato.candidato || 'Candidato Indefinido'}</div>
                                <button className="button button-aceitar" onClick={() => aceitarCandidato(candidato.id_candidato, candidato.id_bico)}>
                                    <span className="icon">✔️</span>
                                </button>
                                <button className="button button-negar" onClick={() => negarCandidato(candidato.id_candidato, candidato.id_bico)}>
                                    <span className="icon">❌</span>
                                </button>

                                {candidatosAceitos.has(candidato.id_candidato) && (
                                    <div style={{ color: 'green' }}>Contratado</div>
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
