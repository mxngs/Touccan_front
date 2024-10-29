import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import './App.css'; 

const Cofre = () => {
    const [startIndex, setStartIndex] = useState(0);
    const maxNotifications = 4; 
    const [isEditing, setIsEditing] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);

    const caixas = [
        { nome: 'Maria Clara', cargo: 'Assistente Administrativo', valor: 'R$ 100,00', data: '01/01/2023' },
        { nome: 'Gustavo Campos', cargo: 'Atendente', valor: 'R$ 200,00', data: '02/01/2023' },
        { nome: 'Gabrielle Bueno', cargo: 'Auxiliar', valor: 'R$ 150,00', data: '03/01/2023' },
        { nome: 'João Silva', cargo: 'Desenvolvedor', valor: 'R$ 300,00', data: '04/01/2023' },
        { nome: 'Ana Pereira', cargo: 'Designer', valor: 'R$ 250,00', data: '05/01/2023' },
        { nome: 'Lucas Souza', cargo: 'Engenheiro', valor: 'R$ 350,00', data: '06/01/2023' },
        { nome: 'Paula Lima', cargo: 'Analista', valor: 'R$ 280,00', data: '07/01/2023' }
    ];

    const updateNotifications = () => {
        return caixas.slice(startIndex, startIndex + maxNotifications);
    };

    const handleUpClick = () => {
        setStartIndex(prev => Math.max(prev - 1, 0));
    };

    const handleDownClick = () => {
        setStartIndex(prev => Math.min(prev + 1, caixas.length - maxNotifications));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsEditing(false);
        }
    };

    const handleSave = () => {
        setNotificationVisible(true);
        setTimeout(() => {
            setNotificationVisible(false);
            setIsEditing(false);
        }, 3000); 
    };

    return (
        
        <div className="content-principal">

               <Sidebar />

       <div className="content">



            <h1 className="titulo">Cofre</h1>
             <div className="linha-laranja"></div> 

            <div className="container">
                <div className="caixas-container" id="caixas-container">
                    {updateNotifications().map((caixa, index) => (
                        <div className="caixa" key={index}>
                            <h2 className="titulo-caixa">{caixa.nome} - {caixa.cargo}</h2>
                            <p className="valor">{caixa.valor}</p>
                            <p className="data">{caixa.data}</p>
                        </div>
                    ))}
                </div>

                <div className="cartao-info">
                    <div className="linha-decorativa"></div>
                    <div className="titulo-cartao">Meu cartão</div>
                    <div className="subtitulo">Você pode ter no máximo <br /> &nbsp; UM cartãos cadastrado</div>
                    <div className="caixa-cartao">
                        <img src="./cartao.png" className="icon-cartao" alt="Ícone do Cartão" />
                        <div className="detalhes-cartao">
                            <div className="titulo-detalhe"> Apelido • Débito </div>
                            <div className="subtitulo-detalhe">••••7865</div>
                        </div>
                    </div>
                    <button className="botao-editar" onClick={handleEditClick}>Editar cartão</button>
                </div>
            </div>

            <div className="botoes-navegacao">
                <button className="botao-seta" onClick={handleUpClick} disabled={startIndex === 0}>⬆</button>
                <button className="botao-seta" onClick={handleDownClick} disabled={startIndex + maxNotifications >= caixas.length}>⬇</button>
            </div>

            {isEditing && (
                <div className="overlay" onClick={handleOverlayClick}>
                    <div className="card-editar" id="card-editar">
                        <h2>Editar Cartão</h2>
                        <div className="campos">
                            <input type="text" placeholder="Número do cartão" required />
                            <input type="text" placeholder="Validade (MM/AA)" required />
                            <input type="text" placeholder="CVV" required />
                        </div>
                        <input type="text" placeholder="Nome do titular" required />
                        <input type="text" placeholder="CNPJ/CPF" required />
                        <input type="text" placeholder="Apelido do cartão (opcional)" />
                        <button className="botao-salvar" onClick={handleSave}>Salvar</button>
                    </div>
                </div>
            )}

            {notificationVisible && (
                <div id="notificacao" className="notificacao">Salvo com sucesso</div>
            )}
        </div>
        </div>
    );
};

export default Cofre;
