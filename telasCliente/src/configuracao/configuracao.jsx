import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Confetti from 'react-confetti';
import './App.css';

const Configuracao = () => {
    const [userData, setUserData] = useState(null);
    const [isPremium, setIsPremium] = useState(false);
    const [currentView, setCurrentView] = useState('image');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showConfetti, setShowConfetti] = useState(false);

    const handleLogout = () => {

        const confirmed = window.confirm('Tem certeza de que deseja sair?');
        if (confirmed) {
            localStorage.removeItem("id_cliente");
            window.location.href = '/';
        }
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
                const errorData = await response.json();
                console.error('Erro ao buscar dados:', errorData); // Log detalhado do erro
                alert('Erro ao buscar dados do cliente');
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error); // Log do erro completo
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


        const confirmed = window.confirm(
            isPremium
                ? "Tem certeza que deseja cancelar sua assinatura Premium?"
                : "Tem certeza que deseja se tornar Premium?"
        );

        if (!confirmed) return;


        const newPremiumStatus = isPremium ? 0 : 1;
        setIsPremium(newPremiumStatus);

        try {

            const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/premium/cliente/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ premium: newPremiumStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao atualizar status Premium:', errorData);
                alert('Erro ao atualizar status Premium. Detalhes: ' + errorData.message);
                setIsPremium(!newPremiumStatus);
            } else {
                alert(newPremiumStatus === 1 ? 'Agora você é Premium!' : 'Premium cancelado!');
                if (newPremiumStatus === 1) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 10000); 
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar o status Premium:', error);
            alert('Erro na atualização. Tente novamente.');
            setIsPremium(!newPremiumStatus);
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
            // Garantir que o CEP seja uma string no corpo da requisição
            const updatedFormData = { ...formData, cep: formData.cep.toString() };
    
            const response = await fetch(`http://localhost:8080/2.0/touccan/infos/cliente/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),  // Aqui enviamos os dados com o CEP garantido como string
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
                <img src="./img/tucano.png" alt="Descrição da Imagem" className="logo-image" />
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
                                    <br />
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
                    <div className="logout-icon" onClick={handleLogout}>
                        <img src="./img/sair.png" alt="Sair" className="logout-img" />
                    </div>
                </div>
            )}

            {currentView === 'premium' && (
                <div className="premium-details">
                    <h2 className="account-title">Vire Premium já!</h2>
                    <div className="premium-content">
                        <div className="premium-description">
                            <img src="./img/premium.png" alt="Coroa" className="premium-icon" />
                            <p>Deseja sempre estar em primeiro nos anúncios? Assine já, para ter prioridade sempre.</p>
                            <p><strong>Apenas por R$15,00</strong></p>
                            <p className="premium-note">Valor cobrado mensalmente<br />Cancele quando quiser</p>
                        </div>
                        <button className="premium-button" onClick={togglePremium}>
                            {isPremium ? 'Cancelar Premium' : 'Me tornar Premium'}
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
                        <textarea className='suporte' id="support-message" rows="4" placeholder="Digite sua mensagem aqui..."></textarea>
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

            {/* Animação de Confetes */}
            {showConfetti && <Confetti />}
        </div>
    );
};

export default Configuracao;