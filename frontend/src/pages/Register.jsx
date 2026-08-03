import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../hooks/useAuth';
import './Register.css';

export const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        birthDate: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        reminderEmail: false,
        reminderWhatsapp: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            await register(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Não foi possível criar a conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="form-container">
                <h2>Crie sua Conta</h2>
                <p className="subtitle">Rápido e fácil para agendar seu próximo corte.</p>

                <button type="button" className="google-btn">
                    <FcGoogle size={22} />
                    <span>Cadastrar com o Google</span>
                </button>

                <div className="separator">
                    <span>OU</span>
                </div>

                {error && <p className="form-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nome Completo</label>
                        <input type="text" id="name" name="name" placeholder="Seu nome completo" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthDate">Data de Nascimento</label>
                        <input type="date" id="birthDate" name="birthDate" value={form.birthDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Telefone / WhatsApp</label>
                        <input type="tel" id="phone" name="phone" placeholder="(99) 99999-9999" value={form.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} minLength={6} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repita a senha" value={form.confirmPassword} onChange={handleChange} minLength={6} required />
                    </div>

                    <div className="reminders-group">
                        <p>Deseja receber lembretes?</p>
                        <div className="checkbox-container">
                            <input type="checkbox" id="reminderEmail" name="reminderEmail" checked={form.reminderEmail} onChange={handleChange} />
                            <label htmlFor="reminderEmail">Lembrete por E-mail</label>
                        </div>
                        <div className="checkbox-container">
                            <input type="checkbox" id="reminderWhatsapp" name="reminderWhatsapp" checked={form.reminderWhatsapp} onChange={handleChange} />
                            <label htmlFor="reminderWhatsapp">Lembrete por WhatsApp</label>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Criando...' : 'Criar Conta'}
                    </button>
                </form>

                <p className="login-redirect">
                    Já tem uma conta? <Link to="/login">Faça Login</Link>
                </p>
            </div>
        </div>
    );
};