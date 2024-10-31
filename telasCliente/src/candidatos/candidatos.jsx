import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import './App.css';

const Candidatos = () => {
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);

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
                            <div className="candidate-box" key={candidato.id}>
                                <a href={`https://www.exemplo.com/candidato/${candidato.id}`} target="_self">
                                    <img src={candidato.foto} alt="Foto de Perfil" />
                                </a>
                                <div className="candidate-name">{candidato.candidato}</div> 
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
