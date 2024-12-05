import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Confetti from 'react-confetti';
import Swal from 'sweetalert2'; 
import './App.css';

//funcionando
const Configuracao = () => {
    const [userData, setUserData] = useState(null);
    const [isPremium, setIsPremium] = useState(false);
    const [currentView, setCurrentView] = useState('image');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showConfetti, setShowConfetti] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const toggleView = (view) => {
        setCurrentView(view);
    };
    const handleLogout = () => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você deseja realmente sair?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, sair!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("id_cliente");
                window.location.href = '/';
            }
        });
    };

    const handleSavePassword = async () => {
      
        if (!currentPassword) {
            Swal.fire('Erro', 'A senha atual é obrigatória.', 'warning');
            return;
        }

       
        if (!newPassword || !confirmPassword) {
            Swal.fire('Erro', 'A nova senha e a confirmação são obrigatórias.', 'warning');
            return;
        }

       
        if (newPassword !== confirmPassword) {
            Swal.fire('Erro', 'As senhas não coincidem.', 'warning');
            return;
        }

        const id = localStorage.getItem("id_cliente");
        if (!id) {
            Swal.fire('Erro', 'ID do cliente não encontrado', 'error');
            return;
        }

        try {
            const updatedPasswordData = {
                senha: newPassword, 
            };

            const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/senha/cliente/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPasswordData),
            });

            if (response.ok) {
                Swal.fire('Sucesso', 'Senha atualizada com sucesso!', 'success');
            } else {
                const errorData = await response.json();
                console.error('Erro ao atualizar a senha:', errorData);
                Swal.fire('Erro', `Erro ao atualizar a senha: ${errorData.message}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            Swal.fire('Erro', 'Erro ao atualizar a senha. Tente novamente.', 'error');
        }
    };



    const fetchUserData = async () => {
        const id = localStorage.getItem("id_cliente");
        if (!id) {
            Swal.fire('Erro', 'ID do cliente não encontrado', 'error');
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
                console.error('Erro ao buscar dados:', errorData);
                Swal.fire('Erro', 'Erro ao buscar dados do cliente', 'error');
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            Swal.fire('Erro', 'Erro ao buscar dados do cliente', 'error');
        }
    };

    const togglePremium = async () => {
        const id = localStorage.getItem("id_cliente");
        if (!id) {
            Swal.fire('Erro', 'ID do cliente não encontrado', 'error');
            return;
        }

        const confirmed = await Swal.fire({
            title: isPremium ? "Cancelar assinatura Premium?" : "Tornar-se Premium?",
            html: isPremium
                ? "Tem certeza que deseja cancelar a assinatura Premium?"
                : "<strong>Aviso:</strong> Ao se tornar Premium, será debitado R$15,00 mensalmente de sua conta. Você poderá cancelar quando quiser.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: isPremium ? 'Sim, cancelar!' : 'Sim, tornar-me Premium!',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            },
            buttonsStyling: false, 
        });

        if (!confirmed.isConfirmed) return;

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

            if (response.ok) {
                Swal.fire(
                    'Sucesso',
                    newPremiumStatus === 1
                        ? 'Agora você é Premium! Aproveite os benefícios.'
                        : 'Assinatura Premium cancelada.',
                    'success'
                );
                if (newPremiumStatus === 1) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 10000);
                }
            } else {
                const errorData = await response.json();
                console.error('Erro ao atualizar status Premium:', errorData);
                Swal.fire('Erro', `Erro ao atualizar status Premium: ${errorData.message}`, 'error');
                setIsPremium(!newPremiumStatus);
            }
        } catch (error) {
            console.error('Erro ao atualizar o status Premium:', error);
            Swal.fire('Erro', 'Erro na atualização. Tente novamente.', 'error');
            setIsPremium(!newPremiumStatus);
        }
    };

    const handleSendSupport = async () => {
        const corpo = document.getElementById('support-message').value;
        const assunto = `Suporte para o cliente`; 
        
        if (!corpo) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Por favor, preencha o campo de mensagem.',
            });
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/2.0/touccan/enviar-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assunto: assunto,
                    corpo: corpo,
                }),
            });
    
            if (!response.ok) {
                const errorMessage = response.status === 404 
                    ? 'URL não encontrada. Verifique se o servidor está rodando corretamente.'
                    : 'Ocorreu um erro ao tentar enviar a mensagem.';
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: errorMessage,
                });
                return;
            }
    
            const data = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'E-mail enviado com sucesso!',
                text: data.message || 'Sua mensagem foi enviada com sucesso.',
            }).then(() => {
                // Atualiza a página após o usuário clicar em "OK"
                window.location.reload();
            });
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao tentar enviar seu e-mail.',
            });
        }
    };
    
    
    
    const validateFormData = () => {
        const requiredFields = ['nome_fantasia', 'telefone', 'email', 'cep'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                Swal.fire('Erro', `O campo ${field} é obrigatório.`, 'warning');
                console.log("Erro: Campo obrigatório não preenchido:", field);  
                return false;
            }
        }
        console.log("Validação bem-sucedida", formData);  
        return true;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSaveChanges = async () => {
        if (!validateFormData()) return;

        console.log("Salvando alterações..."); 
        const id_cliente = localStorage.getItem("id_cliente");
        if (!id_cliente) {
            Swal.fire('Erro', 'ID do cliente não encontrado', 'error');
            return;
        }

        try {
            
            const updatedFormData = {
                ...formData,
                cep: formData.cep ? formData.cep.toString() : '' 
            };

            const response = await fetch(`https://touccan-backend-8a78.onrender.com/2.0/touccan/infos/cliente/${id_cliente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

            
            if (response.ok) {
                await fetchUserData();  
                setIsEditing(false);
                
                Swal.fire('Sucesso', 'As alterações foram salvas com sucesso!', 'success');
                
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.error('Erro ao atualizar os dados:', errorData);
                
                Swal.fire('Erro', `Erro ao salvar alterações: ${errorData.message}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao salvar as alterações:', error);
            
            Swal.fire('Erro', 'Erro ao salvar as alterações. Tente novamente.', 'error');
        }
    };




    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="container">
            <Sidebar toggleView={toggleView} />

            <div className="logout-icon" onClick={handleLogout}>
                <img src="./img/sair.png" alt="Sair" className="logout-img" />
            </div>

            <div className="cards-panel">
                <div className="card" onClick={() => toggleView('account')}>
                    <div className="card-content">
                        <img src="../img/usuario.png" alt="Sobre Nós" className="card-icon" />
                        <div>
                            <div className="card-title">Informações da conta</div>
                            <div className="card-description">Veja as informações da conta, como telefone e endereço de e-mail</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('security')}>
                    <div className="card-content">
                        <img src="../img/senha.png" alt="Sobre Nós" className="card-icon" />
                        <div>
                            <div className="card-title">Segurança</div>
                            <div className="card-description">Gerencie a segurança da sua conta</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('support')}>
                    <div className="card-content">
                        <img src="../img/suporte.png" alt="Sobre Nós" className="card-icon" />
                        <div>
                            <div className="card-title">Suporte</div>
                            <div className="card-description">Entre em contato conosco de qualquer lugar</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('aboutUs')}>
                    <div className="card-content">
                        <img src="../img/logoColorida.png" alt="Sobre Nós" className="card-icon" />
                        <div>
                            <div className="card-title">Sobre Nós</div>
                            <div className="card-description">Veja algumas informações sobre nossa comunidade</div>
                        </div>
                    </div>
                </div>
                <div className="card" onClick={() => toggleView('premium')}>
                    <div className="card-content">
                        <img src="../img/premium.png" alt="Premium" className="card-icon" />
                        <div>
                            <div className="card-title">Premium</div>
                            <div className="card-description">Tornar-se premium.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="separator"></div>

            <div className="image-panel" style={{ display: currentView === 'image' ? 'flex' : 'none' }}>
                <img src="../../img/tucano.png" alt="Descrição da Imagem" className="logo-image" />
                <div className="image-description">O que deseja acessar?</div>
            </div>

            {currentView === 'account' && userData && (
                <div className="account-details">
                    <h2 className="account-titlee">Informações da Conta</h2>

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
                                <div className="infoConta">
                                    <button onClick={handleSaveChanges}>Salvar Alterações</button>
                                    <button onClick={() => setIsEditing(false)}>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="infos"><strong>Nome do Usuário:</strong> <br /> {userData.nome_fantasia}</div>
                                <div className="infos"><strong>Telefone:</strong> <br /> {userData.telefone}</div>
                                <div className="infos"><strong>E-mail:</strong> <br /> {userData.email}</div>
                                <div className="infos"><strong>CEP:</strong> <br /> {userData.cep}</div>

                                <div className="button-container">
                                    <button onClick={() => setIsEditing(true)}>Editar Informações</button>
                                </div>
                            </div>

                        )}
                    </div>

                </div>
            )}

            {currentView === 'premium' && (
                <div className="premium-details">
                    <h2 className="accountt-titlee">Vire Premium já!</h2>
                    <div className="premium-content">
                        <div className="premium-description">
                            <img src="../../img/premium.png" alt="Coroa" className="premium-icon" />
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
                    <h2 className="account-titlee">Segurança</h2>
                    <div className="account-cardSeg">
                        <div className="security-form">
                            <div className="info">
                                <div className="info-title">Senha Atual:</div>
                                <input
                                    type="password"
                                    placeholder="Escreva sua senha atual"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="info">
                                <div className="info-title">Nova Senha:</div>
                                <input
                                    type="password"
                                    placeholder="Pelo menos 8 caracteres"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="info">
                                <div className="info-title">Confirmar Senha:</div>
                                <input
                                    type="password"
                                    placeholder="Pelo menos 8 caracteres"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button className="logout-button" onClick={handleSavePassword}>
                                Atualizar Senha
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {currentView === 'support' && (
                <div className="support-panel">
                    <h2 className="account-titlee">Suporte</h2>
                    <div className="account-cardSuport">
                        <div className="contato">E-mail para contato</div>
                        <div className="info-value">contato.touccan@gmail.com</div>
                        <div className="info-title">Encontrou algum problema? reporte para nós</div>
                        <textarea
                            className='suporte'
                            id="support-message"
                            rows="4"
                            placeholder="Digite sua mensagem aqui..."
                        ></textarea>
                        <div className="character-count">0/500 caracteres</div>
                        <button className="send-button" onClick={handleSendSupport}>Enviar Reporte</button>

                    </div>
                </div>
            )}

            {currentView === 'aboutUs' && (
                <div className="about-us">
                    <h2 className="account-titlee">Sobre Nós</h2>
                    <div className="account-cardAbout">
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

            {showConfetti && (
                <Confetti
                    recycle={false}
                    numberOfPieces={300}
                    gravity={0.1}
                    initialVelocityY={30}
                    initialVelocityX={30}
                    width={window.innerWidth}
                    height={window.innerHeight}
                />
            )}
        </div>
    );
};

export default Configuracao;
