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
    const [notificationVisible, setNotificationVisible] = useState(false); // Novo estado para controle da notificação

    const updateNotifications = () => historico.slice(startIndex, startIndex + maxNotifications);

    const handleUpClick = () => setStartIndex(prev => Math.max(prev - 1, 0));
    const handleDownClick = () => setStartIndex(prev => Math.min(prev + 1, historico.length - maxNotifications));

    const handleEditClick = () => setIsEditing(true);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) setIsEditing(false);
    };

    const handleSave = async () => {
        if (!idCliente) {
            console.error('ID do cliente não encontrado');
            return;
        }

        const cartaoData = {
            numero: formatNumeroCartao(formData.numero),
            validade: formatValidade(formData.validade),
            cvv: formatCVV(formData.cvv),
            nome_titular: formData.nome_titular,
            cpf: formatCPF(formData.cpf),
            apelido: formData.apelido,
            id_cliente: idCliente
        };

        console.log('Dados a serem enviados:', cartaoData);

        const url = cartaoCadastrado
            ? `http://localhost:8080/2.0/touccan/cliente/cartao/${idCliente}`
            : 'http://localhost:8080/2.0/touccan/cliente/cartao';

        const method = cartaoCadastrado ? 'PUT' : 'POST';

        try {
            const response = await axios({
                method: method,
                url: url,
                data: cartaoData
            });
            console.log('Resposta da requisição:', response);
            setCartaoCadastrado(true); // Marca o cartão como cadastrado
            setNotificationVisible(true);
            setTimeout(() => {
                setNotificationVisible(false);
                setIsEditing(false);
            }, 3000);

            // Busca as informações do cartão após salvar
            fetchCartao(idCliente);

        } catch (error) {
            console.error('Erro ao fazer a requisição do histórico:', error);
        }
    };

    useEffect(() => {
        if (idCliente && !cartaoCadastrado) {
            fetchCartao(idCliente);
            fetchHistorico(idCliente);
        }
    }, [idCliente, cartaoCadastrado]);

    const fetchCartao = async (id_cliente) => {
        try {
            const response = await axios.get(`http://localhost:8080/2.0/touccan/cliente/cartao/${id_cliente}`);
            const cartao = response.data;
            if (cartao) {
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
            console.error('Erro ao buscar o cartão:', error);
        }
    };

    const fetchHistorico = async (id_cliente) => {
        try {
            const response = await axios.get(`http://localhost:8080/2.0/touccan/cliente/historico/${id_cliente}`);
            setHistorico(response.data);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        }
    };

    const formatNumeroCartao = (value) => value.replace(/\D/g, '').slice(0, 16);
    const formatValidade = (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    const formatCVV = (value) => value.replace(/\D/g, '').slice(0, 3);
    const formatCPF = (value) => value.replace(/\D/g, '').slice(0, 11);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

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

                                <button className="botao-salvar" onClick={handleSave}>Salvar</button>
                            </div>
                        </div>
                    </div>
                )}

                {notificationVisible && (
                    <div className="notification">Cartão salvo com sucesso!</div>
                )}
            </div>
        </div>
    );
};

export default Cofre;
