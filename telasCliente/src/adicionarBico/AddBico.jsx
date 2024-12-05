import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Swal from 'sweetalert2';
import './App.css';

const AddBico = () => {
    const baseUrl = 'https://touccan-backend-8a78.onrender.com/2.0/touccan';
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        horario_inicio: '',
        data_inicio: '',
        horario_limite: '',
        data_limite: '',
        salario: '',
        id_dificuldade: '',
        id_categoria: ''
    });

    const [salarioExibido, setSalarioExibido] = useState(''); 
    const [erros, setErros] = useState({});
    const [idCliente, setIdCliente] = useState(null);

    const getCategorias = async () => {
        const response = await fetch(`${baseUrl}/categoria`);
        const data = await response.json();
        return data.categorias;
    };

    const preencherSelectCategoria = async () => {
        let categorias = await getCategorias();
        const categoriaSelect = document.getElementById('categoria-select');
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.categoria;
            categoriaSelect.appendChild(option);
        });
    };

    useEffect(() => {
        const id = localStorage.getItem("id_cliente");
        if (id) {
            setIdCliente(id);
        } else {
            console.error('ID do cliente não encontrado no localStorage');
        }
        preencherSelectCategoria();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'salario') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setSalarioExibido(
                numericValue
                    ? `R$ ${Number(numericValue / 100).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                    })}`
                    : ''
            );
            setFormData(prevData => ({
                ...prevData,
                salario: numericValue / 100 // Armazena o valor bruto no state
            }));
        } else {
            const formattedValue =
                (name === 'titulo' || name === 'descricao') && value
                    ? value.charAt(0).toUpperCase() + value.slice(1)
                    : value;

            setFormData(prevData => ({
                ...prevData,
                [name]: formattedValue
            }));
        }
    };

    const validateForm = () => {
        const novosErros = {};
        if (!formData.titulo) novosErros.titulo = "Título é obrigatório.";
        if (!formData.descricao) novosErros.descricao = "Descrição é obrigatória.";
        if (!formData.horario_inicio) novosErros.horario_inicio = "Horário de início é obrigatório.";
        if (!formData.data_inicio) novosErros.data_inicio = "Data de início é obrigatória.";
        if (!formData.horario_limite) novosErros.horario_limite = "Horário limite é obrigatório.";
        if (!formData.data_limite) novosErros.data_limite = "Data limite é obrigatória.";
        if (!formData.salario) novosErros.salario = "Salário é obrigatório.";
        if (!formData.id_dificuldade) novosErros.id_dificuldade = "Nível de dificuldade é obrigatório.";
        if (!formData.id_categoria) novosErros.id_categoria = "Categoria é obrigatória.";

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idCliente) {
            console.error("ID do cliente não encontrado para o envio");
            return;
        }

        if (validateForm()) {
            // Calcula o valor com 15% de desconto
            const salarioComDesconto = formData.salario * 0.85;
            const salarioExibidoComDesconto = `R$ ${salarioComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

            // Exibe o SweetAlert2 com a confirmação
            Swal.fire({
                title: 'Confirmar',
                text: `O valor do salário será R$ ${salarioExibidoComDesconto} após o desconto de 15% de taxa de serviço. Você concorda?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Adiciona a taxa já descontada no payload
                    const dadosLimpos = {
                        ...formData,
                        id_cliente: parseInt(idCliente, 10),
                        salario: salarioComDesconto // Valor com desconto
                    };

                    try {
                        const response = await fetch(`${baseUrl}/bicos`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(dadosLimpos),
                        });
                        if (response.ok) {
                            const result = await response.json();
                            Swal.fire('Sucesso', 'Anúncio criado com sucesso!', 'success');
                            navigate('/home');
                        } else {
                            Swal.fire('Erro', 'Erro ao criar o anúncio.', 'error');
                        }
                    } catch (error) {
                        console.error('Erro de rede:', error);
                    }
                }
            });
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div>
            <Sidebar />
            <div className='addBico-container'>
                <div className='bico-app-container'>
                    <h1>Criar Anúncio</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="bico-input-container">
                            <label>Título</label>
                            <input
                                type='text'
                                name='titulo'
                                value={formData.titulo}
                                onChange={handleInputChange}
                            />
                            {erros.titulo && <span className="error">{erros.titulo}</span>}
                        </div>

                        <div className="bico-input-container">
                            <label>Descrição</label>
                            <textarea
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleInputChange}
                            ></textarea>
                            {erros.descricao && <span className="error">{erros.descricao}</span>}
                        </div>

                        <div className="bico-input-container">
                            <label>Horário Início - Espediente</label>
                            <input
                                type='time'
                                name='horario_inicio'
                                value={formData.horario_inicio}
                                onChange={handleInputChange}
                            />
                            {erros.horario_inicio && <span className="error">{erros.horario_inicio}</span>}
                        </div>

                        <div className="bico-input-container">
                            <label>Data Início - Espediente</label>
                            <input
                                type='date'
                                name='data_inicio'
                                min={today}
                                value={formData.data_inicio}
                                onChange={handleInputChange}
                            />
                            {erros.data_inicio && <span className="error">{erros.data_inicio}</span>}
                        </div>

                        <div className="bico-input-container">
                            <label>Horário Final - Espediente</label>
                            <input
                                type='time'
                                name='horario_limite'
                                value={formData.horario_limite}
                                onChange={handleInputChange}
                            />
                            {erros.horario_limite && <span className="error">{erros.horario_limite}</span>}
                        </div>

                        <div className="bico-input-container">
                            <label>Data Limite - Anúncio</label>
                            <input
                                type='date'
                                name='data_limite'
                                min={today}
                                value={formData.data_limite}
                                onChange={handleInputChange}
                            />
                            {erros.data_limite && <span className="error">{erros.data_limite}</span>}
                        </div>

                        <div className="bico-input-container">
                            <label>Salário</label>
                            <input
                                type='text'
                                name='salario'
                                value={salarioExibido}
                                onChange={handleInputChange}
                                placeholder="R$ 0,00"
                            />
                            {erros.salario && <span className="error">{erros.salario}</span>}
                        </div>

                        <div className="bico-input-container">
                            <label>Nível de Dificuldade</label>
                            <select
                                name='id_dificuldade'
                                value={formData.id_dificuldade}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione um nível</option>
                                <option value="1">Baixa</option>
                                <option value="2">Média</option>
                                <option value="3">Alta</option>
                            </select>
                            {erros.id_dificuldade && <span className="error">{erros.id_dificuldade}</span>}
                        </div>

                        <div className="bico-input-container">
                            <label>Categoria</label>
                            <select
                                name='id_categoria'
                                id='categoria-select'
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione uma categoria</option>
                            </select>
                            {erros.id_categoria && <span className="error">{erros.id_categoria}</span>}
                        </div>

                        <button className='button-criar-addBico' type='submit'>CRIAR</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddBico;
