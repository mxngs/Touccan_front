import React, { useState } from 'react';
import './App.css';
import Sidebar from '../components/Sidebar.jsx';

import { Link } from "react-router-dom"; //import do link
import { useNavigate } from 'react-router-dom'; //import da função de navegar



const baseUrl = '';


function Perfil() {
  const [mudarTab, setMudarTab] = useState('sobre');

  const handleTabChange = (tab) => {
    setMudarTab(tab);
};

  

  return (
    <div className='tela-perfil-cliente'>
      <Sidebar/>
      <div className="infos-perfil-cliente">
        <div className="pfp-perfil-cliente">
          <img src="../img/store.png" alt="" />
        </div>
        <span className='nome-perfil-cliente'>Mercado Bom Lugar</span>
        <div className="tabs">
                <button
                    className={`tab-button ${mudarTab === 'sobre' ? 'active' : ''}`}
                    onClick={() => handleTabChange('sobre')}
                >
                    Sobre Nós
                </button>
                <button
                    className={`tab-button ${mudarTab === 'feedback' ? 'active' : ''}`}
                    onClick={() => handleTabChange('feedback')}
                >
                    Feedback
                </button>
        </div>
        <div className={`tab-content ${mudarTab === 'sobre' ? 'active' : ''}`} id='sobre-perfil-cliente'>
          <button>
            Editar Perfil
          </button>
            <div className="inputs-perfil-cliente">
              <div className="endereco-perfil-cliente">
                <input type="text" disabled value="Endereço: "/>
              </div>
              <div className="foto-perfil-cliente">
                <input type="text" disabled value="Imagens da Localização: "/>
              </div>
              <div className="contatos-perfil-cliente">
                <input type="text" disabled value="Contatos: "/>
              </div>
            </div>
            <div className="anuncios-perfil-cliente">
              <span>Anúncios</span>
            </div>
        </div>
        <div className={`tab-content ${mudarTab === 'feedback' ? 'active' : ''}`} id='feedback-perfil-cliente'>
          <div className="teste-perfil-cliente">
            <span>funciona funciona funciona funciona</span>
          </div>
        </div>
      </div>
    </div>
  );
}
  

export default Perfil;
