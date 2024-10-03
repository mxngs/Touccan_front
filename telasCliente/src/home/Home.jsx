import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import MainContent from './MainContent';
import { Link } from "react-router-dom"; //import do link

import './App.css';

function Home() {

   

    return (
        <div className="container">

            <Sidebar />
            <MainContent />

            <div className="profile-icon">
                <img src="../img/person.png" alt="Perfil" />
            </div>

            <div className="addBico">
                <Link to="/AddBico">
                <button></button>
                </Link>
                
            </div>
            
        </div>
    );
}

export default Home;
