// src/services/authService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.0.18:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await authService.getCurrentToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error('Token error:', error);
            return config;
        }
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

const authService = {
    async login(email, password) {
        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password
            });
            
            if (response.data.data.token) {
                await AsyncStorage.setItem('userToken', response.data.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred' };
        }
    },

    async register(name, email, password) {
        try {
            const response = await axiosInstance.post('/auth/register', {
                name,
                email,
                password
            });
            
            if (response.data.data.token) {
                await AsyncStorage.setItem('userToken', response.data.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred' };
        }
    },

    async logout() {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    async getCurrentToken() {
        try {
            return await AsyncStorage.getItem('userToken');
        } catch (error) {
            console.error('Get token error:', error);
            return null;
        }
    },

    async getCurrentUser() {
        try {
            const userJSON = await AsyncStorage.getItem('userData');
            return userJSON ? JSON.parse(userJSON) : null;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }
};

export default authService;