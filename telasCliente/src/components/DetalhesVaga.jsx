import React from 'react';
import './DetalhesVaga.css';
import { Link } from "react-router-dom"; // import do link

const DetalhesVaga = () =>{
    return (
        <div className="detalhes-vaga">
            <div className="container-detalhes">
                <div className="info-nome-dificuldade">
                    <div className="info-empresa">
                        <picture>
                            <img src="../../img/person.png" alt=""/>
                        </picture>
                        <h2>Empresa 1</h2>
                    </div>
                    <div className="info-dificuldade">
                        <span>Dificuldade: </span>
                        <span>Baixa</span>
                    </div>
                </div>

                <h3 className='titulo-trabalho-detalhes'>Assistente admnistrativo</h3>
                <p className='descricao-detalhes'>Trabalho focado em organizar e atender clientes 
                    com intuito de disponibilidade hoje!</p>

                <div className="info-horario-pagamento">
                    <span>Data: 24/10/2024</span> <br></br>
                    <span>Início: 08:00</span> <br></br>
                    <span>Início: 17:00</span>
                    <div>
                    <span>Pagamento: </span><span className='valor-pagamento'>R$200,00</span>
                    </div>
                </div>
            </div>
            <div className="container-botoes">
                <button className="ver-candidatos">
                    Ver candidatos
                </button>
                <button className="excluir-anuncio" id='excluir-anuncio'>
                    Excluir anúncio
                </button>
            </div>
        </div>
    )
}

export default DetalhesVaga;