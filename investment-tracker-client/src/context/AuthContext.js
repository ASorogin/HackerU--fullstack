// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Auth status check error:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            setUser(response.data.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await authService.register(name, email, password);
            setUser(response.data.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};