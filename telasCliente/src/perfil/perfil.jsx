import React, { useState } from 'react';
import './App.css';
import Sidebar from '../components/Sidebar.jsx';
import { Link } from "react-router-dom"; //import do link
import { useNavigate } from 'react-router-dom'; //import da função de navegar



const baseUrl = '';


function Perfil() {

  

  return (
    <div>
      <Sidebar  />
    </div>
  );
}

export default Perfil;
