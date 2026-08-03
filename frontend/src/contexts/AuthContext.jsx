import React, { createContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'barberflow:auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const { user: storedUser, token: storedToken } = JSON.parse(stored);
            setUser(storedUser);
            setToken(storedToken);
        }
    }, []);

    const persist = (data) => {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const login = async (email, password) => {
        const data = await loginUser({ email, password });
        persist(data);
    };

    const register = async (payload) => {
        const data = await registerUser(payload);
        persist(data);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};
