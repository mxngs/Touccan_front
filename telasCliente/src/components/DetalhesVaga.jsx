import React from 'react';
import './DetalhesVaga.css';
import { Link, useNavigate } from "react-router-dom";

const DetalhesVaga = ({ anuncio, onClose }) => {
    const navigate = useNavigate();

    
    const handleVerCandidatos = () => {
       
        localStorage.setItem("id_bico", anuncio.id);
        navigate('/candidatos'); 
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Você tem certeza que deseja excluir este anúncio?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/2.0/touccan/bico/${anuncio.id}`, {
                    method: 'DELETE',
                });
    
                if (response.ok) {
                    alert("Anúncio excluído com sucesso!");
                    onClose(); 
                    navigate('/home'); 
                } else {
                    alert("Erro ao excluir o anúncio.");
                }
            } catch (error) {
                console.error("Erro:", error);
                alert("Erro ao excluir o anúncio.");
            }
        }
    };

    return (
        <div className="detalhes-vaga">
            <div className="container-detalhes">
                <div className="info-nome-dificuldade">
                    <div className="info-empresa">
                        <picture>
                            <img src="../../img/person.png" alt="" />
                        </picture>
                        <h2>{anuncio.cliente?.[0]?.nome_fantasia || 'Não disponível'}</h2>
                    </div>
                    <div className="info-dificuldade">
                        <span>Dificuldade: {anuncio.dificuldade[0]?.dificuldade || 'Não especificada'}</span>
                    </div>
                </div>

                <h3 className='titulo-trabalho-detalhes'>{anuncio.titulo}</h3>
                <p className='descricao-detalhes'>{anuncio.descricao}</p>

                <div className="info-horario-pagamento">
                    <span>Data: {new Date(anuncio.horario_inicio).toLocaleDateString()}</span> <br />
                    <span>Início: {new Date(anuncio.horario_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> <br />
                    <span>Fim: {new Date(anuncio.horario_limite).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div>
                        <span>Pagamento: </span><span className='valor-pagamento'>R$ {anuncio.salario.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className="container-botoes">
                <button className="ver-candidatos" onClick={handleVerCandidatos}>
                    Ver candidatos
                </button>

                <button className="excluir-anuncio" id='excluir-anuncio' onClick={handleDelete}>
                    Excluir anúncio
                </button>
            </div>
        </div>
    );
}

export default DetalhesVaga;
