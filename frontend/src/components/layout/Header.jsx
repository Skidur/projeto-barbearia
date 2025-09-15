import React from 'react';
import { NavHashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
    return (
        <header className="header">
            <div className="logo">BarberFlow</div>
            <nav className="navigation">
                <NavHashLink to="/#" smooth>Início</NavHashLink>
                <NavHashLink to="/#sobre" smooth>Sobre</NavHashLink>
                <NavHashLink to="/#servicos" smooth>Serviços</NavHashLink>
                <NavHashLink to="/#equipe" smooth>Equipe</NavHashLink>
                <NavHashLink to="/agendamento">Agendamento</NavHashLink>
            </nav>
            <div className="auth-buttons">
                <button className="btn btn-secondary">Login</button>
                <Link to="/register" className="btn btn-primary">Cadastrar</Link>
            </div>
        </header>
    );
};