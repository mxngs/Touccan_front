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
        apelido: '',
    });
    let idTeste = localStorage.getItem('id_cliente')
    const [idCliente, setIdCliente] = useState(idTeste); // Alterar para o ID correto em produção
    const [historico, setHistorico] = useState([]);
    const [notification, setNotification] = useState({ visible: false, message: '', type: '' });

    const updateNotifications = () => historico;

    const handleUpClick = () => setStartIndex((prev) => Math.max(prev - 1, 0));
    const handleDownClick = () =>
        setStartIndex((prev) => Math.min(prev + 1, historico.length - maxNotifications));

    const handleEditClick = () => setIsEditing(true);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) setIsEditing(false);
    };

    const showNotification = (message, type) => {
        setNotification({ visible: true, message, type });
        setTimeout(() => setNotification({ visible: false, message: '', type: '' }), 3000);
    };

    const handleSave = async () => {
        const requiredFields = ['numero', 'validade', 'cvv', 'nome_titular', 'cpf', 'apelido'];
        const errors = {};

        requiredFields.forEach((field) => {
            if (!formData[field].trim()) {
                errors[field] = 'Este campo é obrigatório';
            }
        });

        if (Object.keys(errors).length > 0) {
            showNotification('Preencha todos os campos obrigatórios.', 'error');
            return;
        }

        const cartaoData = {
            numero: formatNumeroCartao(formData.numero),
            validade: formatValidade(formData.validade),
            cvv: formatCVV(formData.cvv),
            nome_titular: formData.nome_titular,
            cpf: formatCPF(formData.cpf),
            apelido: formData.apelido,
            id_cliente: idCliente,
        };

        const url = cartaoCadastrado
            ? `https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/cartao/${idCliente}`
            : 'https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/cartao';

        const method = cartaoCadastrado ? 'PUT' : 'POST';

        try {
            const response = await axios({
                method,
                url,
                data: cartaoData,
            });
            showNotification('Cartão salvo com sucesso!', 'success');
            setCartaoCadastrado(true);
            setIsEditing(false);
            fetchCartao(idCliente);
        } catch (error) {
            console.error(`Erro na requisição ${method}:`, error.response?.data || error.message);
            showNotification('Erro ao salvar o cartão. Verifique os dados.', 'error');
        }
    };

    useEffect(() => {
        if (idCliente) {
            fetchCartao(idCliente);
            fetchHistorico(idCliente);
        }
    }, [idCliente]);

    const fetchCartao = async (id_cliente) => {
        try {
            const response = await axios.get(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/cartao/${id_cliente}`);
            console.log('Cartão encontrado:', response.data);  // Verifique a resposta
            let cartao = response.data.cartao
            setFormData({
                ...formData,
                numero: cartao[0].numero,
                validade: cartao[0].validade,
                cvv: cartao[0].cvv,
                nome_titular: cartao[0].nome_titular,
                cpf: cartao[0].cpf,
                apelido: cartao[0].apelido,
            });
            setCartaoCadastrado(true); // Se o cartão for encontrado, marque como cadastrado
        } catch (error) {
            console.error('Erro ao buscar o cartão:', error.response?.data || error.message);
            if (error.response?.status === 404) {
                showNotification('Cartão não encontrado. Cadastre um novo.', 'error');
            } else {
                showNotification('Erro ao buscar o cartão. Tente novamente mais tarde.', 'error');
            }
        }
    };

    const fetchHistorico = async (id_cliente) => {
        try {
            const response = await axios.get(
                `https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/historico/${id_cliente}`
            );
            console.log('Histórico retornado:', response.data); // Verifique a resposta
            setHistorico(response.data.historico || []);  // Atualiza o estado com os dados retornados
        } catch (error) {
            console.error('Erro ao buscar histórico:', error.response?.data || error.message);
            setHistorico([]); // Caso não haja histórico, deixe vazio
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
            currency: 'BRL',
        }).format(valor);
    };

    return (
        <div className="content-principal">
            <Sidebar />
            <div className="content">
                <h1 className="tituloo">Cofre</h1>
                <div className="linha-laranjaa"></div>
                <div className="containerChat">
                    <div className="caixas-container" id="caixas-container">
                        {historico.filter((caixa) => caixa.finalizado === 1).map((caixa, index) => (
                                <div className="caixaa" key={index}>
                                    <h2 className="titulo-caixa">
                                        {caixa.nome || 'Sem Nome'} - {caixa.titulo || 'Sem Título'}
                                    </h2>
                                    <p className="salarioCofre">{formatarSalario(caixa.salario || 0)}</p>
                                    <p className="dataCofre">{formatDate(caixa.data_inicio)}</p>
                                    <p className="status-pendente">Pagamento feito com sucesso</p>
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
                                <img
                                    src="/cartao.png"
                                    className="icon-cartao"
                                    alt="Ícone do Cartão"
                                />
                                <div className="detalhes-cartao">
                                    <div className="titulo-detalhe">
                                        {formData.apelido && formData.apelido.trim() ? formData.apelido : 'Apelido não definido'} • Débito
                                    </div>
                                    <div className="subtitulo-detalhe">
                                        {formData.numero ? `•••• ${formData.numero.slice(-4)}` : '•••• •••• •••• ••••'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="sem-cartao">Nenhum cartão cadastrado.</p>
                        )}

                        <button className="botao-editaar" onClick={handleEditClick}>
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
                                    placeholder="Apelido do Cartão"
                                    value={formData.apelido}
                                    onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
                                />

                                <div className="botoes">
                                    <button onClick={handleSave}>Salvar</button>
                                    <button onClick={() => setIsEditing(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {notification.visible && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cofre;
