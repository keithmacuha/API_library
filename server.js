require('dotenv').config();

// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

const app = express();

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGODB connected: ${conn.connection.host}`);

        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        })
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

connectDB();

app.use(express.json());
app.use(cookieParser());

// Define the port for the server
const PORT = process.env.PORT || 5000

app.use('/api/users', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/borrow', borrowRoutes);


