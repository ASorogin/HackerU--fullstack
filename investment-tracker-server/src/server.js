// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import connectDB from './config/db.config.js';
import investmentRoutes from './routes/investment.routes.js';
import subscriberRoutes from './routes/subscriber.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Connect to database
try {
    await connectDB();
    console.log('MongoDB connected successfully');
} catch (error) {
    console.error('MongoDB connection error:', error.message);
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/subscriber', subscriberRoutes);
app.use('/api/admin', adminRoutes);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Investment Tracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});