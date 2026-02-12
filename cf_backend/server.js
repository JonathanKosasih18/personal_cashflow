require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db'); 

// Import Routes
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware and JSON Parsing
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Personal Cashflow API is running 🚀' });
});

// API Routes
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});