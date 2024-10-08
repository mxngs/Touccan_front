import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './login/Login.jsx'
import Cadastro from './cadastro/Cadastro.jsx'
import AddBico from './adicionarBico/AddBico.jsx'
import Home from './home/Home.jsx'
import "./login/App.css"
import Perfil from './perfil/perfil.jsx'


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path= "/">
                    <Route index element={<Login />} />
                    <Route path="cadastro" element={< Cadastro />} />
                    <Route path="home" element={< Home />} />
                    <Route path="addBico" element={< AddBico />} />
                    <Route path="perfil" element={< Perfil />} />
                    
                </Route>
            </Routes>
        </BrowserRouter>
    )
}


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);