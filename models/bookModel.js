const mongoose = require('mongoose');

// Define a Mongoose schema for the Book model
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true
        },
        stocks: {
            type: Number,
            required: true
        }
    }, 
    {
        timestamps: true
});

module.exports = new mongoose.model('Book', bookSchema);