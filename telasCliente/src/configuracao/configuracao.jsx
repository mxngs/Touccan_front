import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import './App.css';

const Configuracao = () => {
    const [userData, setUserData] = useState(null); // Dados do usuário
    const [isPremium, setIsPremium] = useState(false); // Status premium
    const [currentView, setCurrentView] = useState('image'); // Controla qual painel mostrar
    const [isEditing, setIsEditing] = useState(false); // Controla se estamos no modo de edição
    const [formData, setFormData] = useState({}); // Dados do formulário para editar

    // Função para fazer logout
    const handleLogout = () => {
        localStorage.removeItem("id_cliente");
        window.location.href = '/'; // Redireciona para a página de login ou inicial
    };

    // Função para buscar os dados do cliente por ID
    const fetchUserData = async () => {
        const id = localStorage.getItem("id_cliente");
        if (!id) {
            alert('ID do cliente não encontrado');
            return;
        }

        try {
            const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log("Dados do cliente recebidos:", data);
                setUserData(data.cliente);
                setFormData(data.cliente); // Preenche os dados do formulário com os dados do cliente
                setIsPremium(data.cliente.premium); // Atualiza o status premium
            } else {
                alert('Erro ao buscar dados do cliente');
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            alert('Erro ao buscar dados do cliente');
        }
    };

    // Função para alternar entre as views (painéis)
    const toggleView = (view) => {
        setCurrentView(view);
    };

    // Função para alterar o status premium
    const togglePremium = async () => {
        const id = localStorage.getItem("id_cliente");
        if (!id) {
            alert('ID do cliente não encontrado');
            return;
        }

        const newPremiumStatus = !isPremium; // Alterna entre premium e não premium
        setIsPremium(newPremiumStatus);

        // Verifique se precisa de autenticação, por exemplo, um token
        const token = localStorage.getItem("auth_token"); // Se usar token, ou substitua conforme necessário
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`; // Supondo que a API use Bearer Token
        }

        try {
            const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/${id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({ premium: newPremiumStatus }), // Corrigido o formato aqui
            });

            if (response.ok) {
                alert(newPremiumStatus ? 'Agora você é Premium!' : 'Premium cancelado!');
            } else {
                const errorData = await response.json();
                alert('Erro ao atualizar status Premium. Detalhes: ' + errorData.message);
                setIsPremium(!newPremiumStatus); // Reverte o estado caso a requisição falhe
            }
        } catch (error) {
            console.error('Erro ao atualizar o status Premium:', error);
            alert('Erro na atualização. Tente novamente.');
            setIsPremium(!newPremiumStatus); // Reverte o estado em caso de erro
        }
    };

    // Função para lidar com a edição do formulário
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Função para salvar as alterações
    const handleSaveChanges = async () => {
        const id = localStorage.getItem("id_cliente");
        if (!id) {
            alert('ID do cliente não encontrado');
            return;
        }

        try {
            const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/cliente/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cliente: formData }), // Corrigido para enviar dados do cliente
            });

            if (response.ok) {
                const updatedData = await response.json(); // Verifica a resposta da API
                console.log("Dados atualizados:", updatedData);
                alert('Dados atualizados com sucesso!');
                setUserData(updatedData.cliente); // Atualiza os dados na interface
                setIsEditing(false); // Fecha o modo de edição
            } else {
                alert('Erro ao salvar alterações.');
            }
        } catch (error) {
            console.error('Erro ao salvar as alterações:', error);
            alert('Erro ao salvar as alterações.');
        }
    };

    // Carrega os dados do cliente ao montar o componente
    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="container">
            <Sidebar toggleView={toggleView} />

            <div className="cards-panel">
                <div className="card" onClick={() => toggleView('account')}>
                    <div className="card-detail"></div>
                    <div className="card-content">
                        <i className="fas fa-info-circle card-icon"></i>
                        <div>
                            <div className="card-title">Informações da conta</div>
                            <div className="card-description">Veja as informações da conta, como telefone e endereço de e-mail</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('security')}>
                    <div className="card-detail"></div>
                    <div className="card-content">
                        <i className="fas fa-lock card-icon"></i>
                        <div>
                            <div className="card-title">Segurança</div>
                            <div className="card-description">Gerencie a segurança da sua conta</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('support')}>
                    <div className="card-detail"></div>
                    <div className="card-content">
                        <i className="fas fa-headset card-icon"></i>
                        <div>
                            <div className="card-title">Suporte</div>
                            <div className="card-description">Entre em contato conosco de qualquer lugar</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('aboutUs')}>
                    <div className="card-detail"></div>
                    <div className="card-content">
                        <img src="./logo - preto.png" alt="Sobre Nós" className="card-icon" />
                        <div>
                            <div className="card-title">Sobre Nós</div>
                            <div className="card-description">Veja algumas informações sobre nossa comunidade</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('premium')}>
                    <div className="card-detail"></div>
                    <div className="card-content">
                        <img src="./icons8-coroa-30 4.png" alt="Premium" className="card-icon" />
                        <div>
                            <div className="card-title">Premium</div>
                            <div className="card-description">Tornar-se premium.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="separator"></div>

            {/* Painel de Imagem Inicial */}
            <div className="image-panel" style={{ display: currentView === 'image' ? 'flex' : 'none' }}>
                <img src="./logo - preto.png" alt="Descrição da Imagem" className="logo-image" />
                <div className="image-description">O que deseja acessar?</div>
            </div>

            {/* Painel de Informações da Conta */}
            {currentView === 'account' && userData && (
                <div className="account-details">
                    <h2 className="account-title">Informações da Conta</h2>
                    <div className="account-card">
                        {isEditing ? (
                            <div>
                                <div className="info">
                                    <label>Nome do Usuário:</label>
                                    <input
                                        type="text"
                                        name="nome_fantasia"
                                        value={formData.nome_fantasia || ''}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="info">
                                    <label>Telefone:</label>
                                    <input
                                        type="text"
                                        name="telefone"
                                        value={formData.telefone || ''}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="info">
                                    <label>E-mail:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="info">
                                    <label>CEP:</label>
                                    <input
                                        type="text"
                                        name="cep"
                                        value={formData.cep || ''}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <button onClick={handleSaveChanges}>Salvar Alterações</button>
                                <button onClick={() => setIsEditing(false)}>Cancelar</button>
                            </div>
                        ) : (
                            <div>
                                <div className="info"><strong>Nome do Usuário:</strong> {userData.nome_fantasia}</div>
                                <div className="info"><strong>Telefone:</strong> {userData.telefone}</div>
                                <div className="info"><strong>E-mail:</strong> {userData.email}</div>
                                <button onClick={() => setIsEditing(true)}>Editar</button>
                            </div>
                        )}
                    </div>
                    <div className="logout-button">
                        <button onClick={handleLogout}>Sair</button>
                    </div>
                </div>
            )}

            {/* Painel de Premium */}
            {currentView === 'premium' && (
                <div className="premium-section">
                    <h2>Status Premium</h2>
                    <p>Você está {isPremium ? 'Premium' : 'não Premium'}</p>
                    <button onClick={togglePremium}>
                        {isPremium ? 'Cancelar Premium' : 'Tornar-se Premium'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Configuracao;
