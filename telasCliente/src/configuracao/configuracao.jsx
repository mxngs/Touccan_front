import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import './App.css';

const Configuracao = () => {
    const [userData, setUserData] = useState(null);
    const [isPremium, setIsPremium] = useState(false);
    const [currentView, setCurrentView] = useState('image');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const handleLogout = () => {
        localStorage.removeItem("id_cliente");
        window.location.href = '/';
    };

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
                setUserData(data.cliente);
                setFormData(data.cliente);
                setIsPremium(data.cliente.premium);
            } else {
                alert('Erro ao buscar dados do cliente');
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            alert('Erro ao buscar dados do cliente');
        }
    };

    const toggleView = (view) => {
        setCurrentView(view);
    };

    const togglePremium = async () => {
        const id = localStorage.getItem("id_cliente");
        if (!id) {
            alert('ID do cliente não encontrado');
            return;
        }
    
        const newPremiumStatus = !isPremium;
        setIsPremium(newPremiumStatus);  // Atualiza o estado local
    
        try {
            // Envia a solicitação PUT para o novo endpoint
            const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/premium/cliente/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ premium: newPremiumStatus }),  // Passa o status de Premium
            });
    
            if (response.ok) {
                alert(newPremiumStatus ? 'Agora você é Premium!' : 'Premium cancelado!');
            } else {
                const errorData = await response.json();
                alert('Erro ao atualizar status Premium. Detalhes: ' + errorData.message);
                setIsPremium(!newPremiumStatus); // Reverte o estado caso o PUT falhe
            }
        } catch (error) {
            console.error('Erro ao atualizar o status Premium:', error);
            alert('Erro na atualização. Tente novamente.');
            setIsPremium(!newPremiumStatus);  // Reverte o estado caso haja erro na requisição
        }
    };
    

    const validateFormData = () => {
        const requiredFields = ['nome_fantasia', 'telefone', 'email', 'cep'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                alert(`O campo ${field} é obrigatório.`);
                return false;
            }
        }
        return true;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async () => {
        if (!validateFormData()) return;

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
                body: JSON.stringify({ cliente: formData }),
            });

            if (response.ok) {
                const updatedData = await response.json();
                alert('Dados atualizados com sucesso!');
                setUserData(updatedData.cliente);
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                alert('Erro ao salvar alterações. Detalhes: ' + errorData.message);
            }
        } catch (error) {
            console.error('Erro ao salvar as alterações:', error);
            alert('Erro ao salvar as alterações.');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="container">
            <Sidebar toggleView={toggleView} />
            
            <div className="cards-panel">
                <div className="card" onClick={() => toggleView('account')}>
                    <div className="card-content">
                        <i className="fas fa-info-circle card-icon"></i>
                        <div>
                            <div className="card-title">Informações da conta</div>
                            <div className="card-description">Veja as informações da conta, como telefone e endereço de e-mail</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('security')}>
                    <div className="card-content">
                        <i className="fas fa-lock card-icon"></i>
                        <div>
                            <div className="card-title">Segurança</div>
                            <div className="card-description">Gerencie a segurança da sua conta</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('support')}>
                    <div className="card-content">
                        <i className="fas fa-headset card-icon"></i>
                        <div>
                            <div className="card-title">Suporte</div>
                            <div className="card-description">Entre em contato conosco de qualquer lugar</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('aboutUs')}>
                    <div className="card-content">
                        <img src="./logo - preto.png" alt="Sobre Nós" className="card-icon" />
                        <div>
                            <div className="card-title">Sobre Nós</div>
                            <div className="card-description">Veja algumas informações sobre nossa comunidade</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('premium')}>
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

            <div className="image-panel" style={{ display: currentView === 'image' ? 'flex' : 'none' }}>
                <img src="./logo - preto.png" alt="Descrição da Imagem" className="logo-image" />
                <div className="image-description">O que deseja acessar?</div>
            </div>

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
                                <div className="info"><strong>CEP:</strong> {userData.cep}</div>
                                <button onClick={() => setIsEditing(true)}>Editar Informações</button>
                            </div>
                        )}
                    </div>
                    <button onClick={handleLogout}>Sair</button>
                </div>
            )}

            {currentView === 'premium' && (
                <div className="premium-details">
                    <h2 className="account-title">Serviço Premium</h2>
                    <div className="premium-content">
                        <p>O serviço premium permite acesso exclusivo a novos recursos.</p>
                        <button onClick={togglePremium}>
                            {isPremium ? 'Cancelar Premium' : 'Tornar-se Premium'}
                        </button>
                    </div>
                </div>
            )}

            {currentView === 'security' && (
                <div className="security-settings">
                    <h2 className="account-title">Segurança</h2>
                    <div className="account-card">
                        <div className="security-form">
                            <div className="info">
                                <div className="info-title">Senha Atual:</div>
                                <input type="password" placeholder="Escreva sua senha atual" />
                            </div>
                            <div className="info">
                                <div className="info-title">Nova Senha:</div>
                                <input type="password" placeholder="Pelo menos 8 caracteres" />
                            </div>
                            <div className="info">
                                <div className="info-title">Confirmar Senha:</div>
                                <input type="password" placeholder="Pelo menos 8 caracteres" />
                            </div>
                            <button className="logout-button">Atualizar Senha</button>
                        </div>
                    </div>
                </div>
            )}

            {currentView === 'support' && (
                <div className="support-panel">
                    <h2 className="account-title">Suporte</h2>
                    <div className="account-card">
                        <div className="contato">E-mail para contato</div>
                        <div className="info-value">contato.touccan@gmail.com</div>
                        <div className="info-title">Encontrou algum problema? reporte para nós</div>
                        <textarea id="support-message"  rows="4" placeholder="Digite sua mensagem aqui..."></textarea>
                        <div className="character-count">0/500 caracteres</div>
                        <button className="send-button">Enviar Reporte</button>
                    </div>
                </div>
            )}

            {currentView === 'aboutUs' && (
                <div className="about-us">
                    <h2 className="account-title">Sobre Nós</h2>
                    <div className="account-card">
                        <div className="sub-title">Quem Somos</div>
                        <div className="info-value">
                            Touccan é uma forma inovadora de conectar pessoas que precisam de empregos temporários de alta remuneração a alguém que precisa de serviços de curto prazo e eficientes. Nossa plataforma permite que as pessoas realizem suas tarefas e contrate-as, com foco naqueles que precisam apenas por um curto período.
                        </div>
                        <div className="sub-title">Nossa Missão</div>
                        <div className="info-value">
                            Nossa missão é simplificar o processo de emprego e contratação, tornando-o ágil e acessível. Acreditamos que todos devem ter a oportunidade de encontrar trabalho que se ajuste às suas necessidades e que os empregadores merecem acesso rápido a profissionais qualificados para serviços temporários.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Configuracao;
