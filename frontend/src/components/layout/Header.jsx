import React from 'react';
import { NavHashLink } from 'react-router-hash-link';
import './Header.css';

export const Header = () => {
    return (
        <header className="header">
            <div className="logo">BarberFlow</div>
            <nav className="navigation">
                <NavHashLink to="/#" smooth>Início</NavHashLink>
                <NavHashLink to="/#servicos" smooth>Serviços</NavHashLink>
                <NavHashLink to="/#sobre" smooth>Sobre</NavHashLink>
                <NavHashLink to="/agendamento">Agendamento</NavHashLink>
            </nav>
            <div className="auth-buttons">
                <button className="login-btn">Login</button>
                <button className='register-btn'>Cadastrar</button>
            </div>
        </header>
    );
};