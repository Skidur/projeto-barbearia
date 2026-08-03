import React from 'react';
import { NavHashLink } from 'react-router-hash-link';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

export const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="logo">BarberFlow</div>
            <nav className="navigation">
                <NavHashLink to="/#" smooth>Início</NavHashLink>
                <NavHashLink to="/#sobre" smooth>Sobre</NavHashLink>
                <NavHashLink to="/#servicos" smooth>Serviços</NavHashLink>
                <NavHashLink to="/#equipe" smooth>Equipe</NavHashLink>
                <Link to={isAuthenticated ? '/booking' : '/login'}>Agendamento</Link>
            </nav>
            <div className="auth-buttons">
                {isAuthenticated ? (
                    <>
                        <span className="user-name">Olá, {user.name.split(' ')[0]}</span>
                        <Link to="/minha-conta" className="btn btn-secondary">Minha Conta</Link>
                        <button type="button" className="btn btn-secondary" onClick={handleLogout}>Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                        <Link to="/register" className="btn btn-primary">Cadastrar</Link>
                    </>
                )}
            </div>
        </header>
    );
};