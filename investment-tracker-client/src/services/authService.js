// src/services/authService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.0.18:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const authService = {
    async register(name, email, password) {
        try {
            console.log('Attempting registration to:', `${API_URL}/auth/register`);
            const response = await axiosInstance.post('/auth/register', {
                name,
                email,
                password
            });
            
            console.log('Registration response:', response.data);
            
            if (response.data.data.token) {
                await AsyncStorage.setItem('userToken', response.data.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error('Registration error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error.response?.data || { 
                message: 'Network error - unable to connect to server' 
            };
        }
    },

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
            console.error('Login error:', error.response?.data || error);
            throw error.response?.data || { 
                message: 'Network error - unable to connect to server' 
            };
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
    },

    // Add authorization header to all requests
    setAuthHeader(token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    // Remove authorization header
    removeAuthHeader() {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

export default authService;