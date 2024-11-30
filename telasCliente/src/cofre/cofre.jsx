import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';
import './App.css';

const Cofre = () => {
    const [startIndex, setStartIndex] = useState(0);
    const maxNotifications = 4;
    const [isEditing, setIsEditing] = useState(false);
    const [cartaoCadastrado, setCartaoCadastrado] = useState(false);
    const [formData, setFormData] = useState({
        numero: '',
        validade: '',
        cvv: '',
        nome_titular: '',
        cpf: '',
        apelido: ''
    });
    const [idCliente, setIdCliente] = useState(null);
    const [historico, setHistorico] = useState([]);

    const updateNotifications = () => historico.slice(startIndex, startIndex + maxNotifications);

    const handleUpClick = () => setStartIndex(prev => Math.max(prev - 1, 0));
    const handleDownClick = () => setStartIndex(prev => Math.min(prev + 1, historico.length - maxNotifications));

    const handleEditClick = () => setIsEditing(true);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) setIsEditing(false);
    };

    const handleSave = () => {
        console.log('Salvando dados do cartão:', formData);
        // Adicione aqui a lógica para salvar o cartão, seja via API ou localmente
        setIsEditing(false);
    };

    useEffect(() => {
        const id = localStorage.getItem('id_cliente');
        if (id) {
            setIdCliente(id);
        } else {
            console.error('ID do cliente não encontrado no localStorage');
        }
    }, []);

    useEffect(() => {
        if (idCliente && !cartaoCadastrado) {
            fetchCartao(idCliente);
            fetchHistorico(idCliente);
        }
    }, [idCliente, cartaoCadastrado]);

    const fetchCartao = async (id_cliente) => {
        try {
            const response = await axios.get(`http://localhost:8080/2.0/touccan/cliente/cartao/${id_cliente}`);
            if (response.data && response.data.cartao && response.data.cartao.length > 0) {
                const cartao = response.data.cartao[0];
                setCartaoCadastrado(true);
                setFormData({
                    numero: cartao.numero || '',
                    validade: cartao.validade || '',
                    cvv: cartao.cvv || '',
                    nome_titular: cartao.nome_titular || '',
                    cpf: cartao.cpf || '',
                    apelido: cartao.apelido || ''
                });
            } else {
                setCartaoCadastrado(false);
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição do cartão:', error);
            setCartaoCadastrado(false);
        }
    };

    const fetchHistorico = async (id_cliente) => {
        try {
            const response = await axios.get(`http://localhost:8080/2.0/touccan/cliente/historico/${id_cliente}`);
            if (response.data && response.data.historico) {
                setHistorico(response.data.historico);
            } else {
                setHistorico([]);
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição do histórico:', error);
        }
    };

    const handlePayment = (itemId) => {
        console.log(`Pagamento realizado para o item com ID: ${itemId}`);
        // Lógica para processar o pagamento
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    // Função para formatar o salário com R$ e vírgulas
    const formatarSalario = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    return (
        <div className="content-principal">
            <Sidebar />
            <div className="content">
                <h1 className="titulo">Cofre</h1>
                <div className="linha-laranja"></div>

                <div className="containerChat">
                    <div className="caixas-container" id="caixas-container">
                        {updateNotifications()
                            .map((caixa, index) => (
                                <div className="caixa" key={index}>
                                    <h2 className="titulo-caixa">{caixa.nome} - {caixa.titulo}</h2>
                                    <p className="salario">{formatarSalario(caixa.salario)}</p> {/* Salário formatado */}
                                    <p className="data_inicio">{formatDate(caixa.data_inicio)}</p>

                                    {caixa.finalizar === 1 ? (
                                        <button
                                            className="botao-pagar"
                                            onClick={() => handlePayment(caixa.id)}
                                        >
                                            Pagar
                                        </button>
                                    ) : (
                                        <p className="status-pendente">Pendente</p>
                                    )}
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
                                    <div className="titulo-detalhe">
                                        {formData.apelido || 'Apelido não definido'} • Débito
                                    </div>
                                    <div className="subtitulo-detalhe">
                                        {formData.numero ? `•••• ${formData.numero.slice(-4)}` : '•••• ****'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="sem-cartao">Nenhum cartão cadastrado.</p>
                        )}

                        <button className="botao-editar" onClick={handleEditClick}>
                            {cartaoCadastrado ? 'Editar cartão' : 'Cadastrar cartão'}
                        </button>
                    </div>
                </div>

                {isEditing && (
                    <div className="overlay" onClick={handleOverlayClick}>
                        <div className="modal">
                            <div className="formulario">
                                <input
                                    type="text"
                                    name="numero"
                                    placeholder="Número do Cartão"
                                    value={formData.numero}
                                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="validade"
                                    placeholder="Validade"
                                    value={formData.validade}
                                    onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder="CVV"
                                    value={formData.cvv}
                                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="nome_titular"
                                    placeholder="Nome do Titular"
                                    value={formData.nome_titular}
                                    onChange={(e) => setFormData({ ...formData, nome_titular: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="cpf"
                                    placeholder="CPF"
                                    value={formData.cpf}
                                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="apelido"
                                    placeholder="Apelido"
                                    value={formData.apelido}
                                    onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
                                />
                            </div>

                            <div className="botoes">
                                <button className="botao-salvar" onClick={handleSave}>
                                    {cartaoCadastrado ? 'Salvar alterações' : 'Adicionar cartão'}
                                </button>
                                <button className="botao-cancelar" onClick={() => setIsEditing(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cofre;
