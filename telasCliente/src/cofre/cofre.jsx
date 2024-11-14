import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import './App.css';

const Cofre = () => {
    const [startIndex, setStartIndex] = useState(0);
    const maxNotifications = 4; 
    const [isEditing, setIsEditing] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [cartaoCadastrado, setCartaoCadastrado] = useState(false);
    const [formData, setFormData] = useState({
        numero: '',
        validade: '',
        cvv: '',
        nome_titular: '',
        cpf: '',
        apelido: ''
    });

    const caixas = [
        { nome: 'Maria Clara', cargo: 'Assistente Administrativo', valor: 'R$ 100,00', data: '01/01/2023' },
        { nome: 'Gustavo Campos', cargo: 'Atendente', valor: 'R$ 200,00', data: '02/01/2023' },
        { nome: 'Gabrielle Bueno', cargo: 'Auxiliar', valor: 'R$ 150,00', data: '03/01/2023' },
        { nome: 'João Silva', cargo: 'Desenvolvedor', valor: 'R$ 300,00', data: '04/01/2023' },
        { nome: 'Ana Pereira', cargo: 'Designer', valor: 'R$ 250,00', data: '05/01/2023' },
        { nome: 'Lucas Souza', cargo: 'Engenheiro', valor: 'R$ 350,00', data: '06/01/2023' },
        { nome: 'Paula Lima', cargo: 'Analista', valor: 'R$ 280,00', data: '07/01/2023' }
    ];

    const updateNotifications = () => caixas.slice(startIndex, startIndex + maxNotifications);

    const handleUpClick = () => setStartIndex(prev => Math.max(prev - 1, 0));
    const handleDownClick = () => setStartIndex(prev => Math.min(prev + 1, caixas.length - maxNotifications));

    const handleEditClick = () => setIsEditing(true);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) setIsEditing(false);
    };

    const handleSave = () => {
        setNotificationVisible(true);
        setCartaoCadastrado(true);
        setTimeout(() => {
            setNotificationVisible(false);
            setIsEditing(false);
        }, 3000);
    };

    const formatData = (value) => {
        return value
            .replace(/\D/g, '') // Remove todos os caracteres não numéricos
            .replace(/(\d{2})(\d)/, '$1/$2') // Adiciona a barra após os 2 primeiros dígitos
            .replace(/\/(\d{2})(\d)/, '/$1/$2') // Adiciona a barra após os 2 dígitos seguintes
            .slice(0, 7); // Limita a 7 caracteres
    };

    const formatCNPJorCPF = (value) => {
        const onlyNumbers = value.replace(/\D/g, '');

        if (onlyNumbers.length <= 11) { // CPF
            return onlyNumbers
                .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto
                .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Adiciona traço
                .slice(0, 14); // Limita a 14 caracteres
        } else { 
            return onlyNumbers
                .replace(/(\d{2})(\d)/, '$1.$2') // Adiciona ponto
                .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto
                .replace(/(\d{3})(\d{1,4})$/, '$1/$2') // Adiciona barra
                .replace(/(\d{2})(\d{1,2})$/, '$1-$2') // Adiciona traço
                .slice(0, 18); // Limita a 18 caracteres
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'validade') {
            setFormData({ ...formData, [name]: formatData(value) });
        } else if (name === 'cnpjCpf') {
            setFormData({ ...formData, [name]: formatCNPJorCPF(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
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
                        <div className="subtitulo">
                            Você pode ter no máximo <br /> &nbsp; UM cartão cadastrado
                        </div>

                        {cartaoCadastrado ? (
                            <div className="caixa-cartao">
                                <img src="/cartao.png" className="icon-cartao" alt="Ícone do Cartão" />
                                <div className="detalhes-cartao">
                                    <div className="titulo-detalhe">Apelido • Débito</div>
                                    <div className="subtitulo-detalhe">••••7865</div>
                                </div>
                            </div>
                        ) : (
                            <p className="sem-cartao">Nenhum cartão cadastrado.</p>
                        )}

                        <button className="botao-editar" onClick={handleEditClick}>
                            {cartaoCadastrado ? 'Editar cartão' : 'Adicionar cartão'}
                        </button>
                    </div>
                </div>

                <div className="botoes-navegacao">
                    <button className="botao-seta" onClick={handleUpClick} disabled={startIndex === 0}>⬆</button>
                    <button className="botao-seta" onClick={handleDownClick} disabled={startIndex + maxNotifications >= caixas.length}>⬇</button>
                </div>

                {isEditing && (
                    <div className={`overlay ${isEditing ? 'overlay-visivel' : ''}`} onClick={handleOverlayClick}>
                        <div className="card-editar" id="card-editar">
                            <h2>{cartaoCadastrado ? 'Editar Cartão' : 'Adicionar Cartão'}</h2>
                            <div className="campos">
                                <input
                                    type="text"
                                    name="numeroCartao"
                                    placeholder="Número do cartão"
                                    maxLength={16}
                                    required
                                    value={formData.numeroCartao}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="validade"
                                    placeholder="Validade (MM/AA)"
                                    maxLength={5}
                                    required
                                    value={formData.validade}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder="CVV"
                                    maxLength={3}
                                    required
                                    value={formData.cvv}
                                    onChange={handleChange}
                                />
                            </div>
                            <input
                                type="text"
                                name="nomeTitular"
                                placeholder="Nome do titular"
                                maxLength={50}
                                required
                                value={formData.nomeTitular}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="cnpjCpf"
                                placeholder="CNPJ/CPF"
                                maxLength={14}
                                required
                                value={formData.cnpjCpf}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="apelido"
                                placeholder="Apelido do cartão (opcional)"
                                maxLength={30}
                                value={formData.apelido}
                                onChange={handleChange}
                            />
                            <button className="botao-salvar" onClick={handleSave}>Salvar</button>
                        </div>
                    </div>
                )}

                {notificationVisible && (
                    <div className="notificacao">Salvo com sucesso</div>
                )}
            </div>
        </div>
    );
};

export default Cofre;
