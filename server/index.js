const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const langRoutes = require('./routes/langRoutes');

const PORT = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(cors())


app.use('/api/lang', langRoutes);

// Corrected MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed", { 
            name: error.name,
            message: error.message,
            code: error.code,
        });
        process.exit(1);
    }
};

// start server 
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('Error starting server:', error);
        process.exit(1);
    }
};

startServer();