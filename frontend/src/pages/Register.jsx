import React from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import './Register.css';

export const Register = () => {
    return (
        <div className="register-page">
            <div className="form-container">
                <h2>Crie sua Conta</h2>
                <p className="subtitle">Rápido e fácil para agendar seu próximo corte.</p>

                <button className="google-btn">
                    <FcGoogle size={22} />
                    <span>Cadastrar com o Google</span>
                </button>

                <div className="separator">
                    <span>OU</span>
                </div>

                <form>
                    <div className="form-group">
                        <label htmlFor="name">Nome Completo</label>
                        <input type="text" id="name" placeholder="Seu nome completo" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Data de Nascimento</label>
                        <input type="date" id="dob" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" placeholder="seu@email.com" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Telefone / WhatsApp</label>
                        <input type="tel" id="phone" placeholder="(99) 99999-9999" required />
                    </div>

                    <div className="reminders-group">
                        <p>Deseja receber lembretes?</p>
                        <div className="checkbox-container">
                            <input type="checkbox" id="email-reminder" />
                            <label htmlFor="email-reminder">Lembrete por E-mail</label>
                        </div>
                        <div className="checkbox-container">
                            <input type="checkbox" id="whatsapp-reminder" />
                            <label htmlFor="whatsapp-reminder">Lembrete por WhatsApp</label>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">Criar Conta</button>
                </form>

                <p className="login-redirect">
                    Já tem uma conta? <Link to="/login">Faça Login</Link>
                </p>
            </div>
        </div>
    );
};