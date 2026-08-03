import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../hooks/useAuth';
import './Register.css';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Não foi possível entrar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="form-container">
                <h2>Entrar</h2>
                <p className="subtitle">Acesse sua conta para agendar seu próximo corte.</p>

                <button type="button" className="google-btn">
                    <FcGoogle size={22} />
                    <span>Entrar com o Google</span>
                </button>

                <div className="separator">
                    <span>OU</span>
                </div>

                {error && <p className="form-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="password" placeholder="Sua senha" value={form.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="login-redirect">
                    Não tem uma conta? <Link to="/register">Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
};
