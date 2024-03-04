const mongoose = require('mongoose');

// Define a Mongoose schema for the User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean, 
        required: true,
        default: false
    }
},
{
    // Enable automatic timestamp generation for 'createdAt' and 'updatedAt' fields
    timestamps: true
});

// Create and export a Mongoose model based on the defined schema
module.exports = new mongoose.model('User', userSchema);