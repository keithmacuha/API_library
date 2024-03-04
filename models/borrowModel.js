const mongoose = require('mongoose');

// Define a Mongoose schema for the BorrowedBook model
const borrowedBookSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: { 
      type: String,
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    quantity: {
      type: Number,
      required: true
    },
    returnDate: {
      type: Date,
    },
    returned: {
      type: Boolean,
      default: false
    }
  });

  // Create and export a Mongoose model based on the defined schema, named BorrowedBook
const BorrowedBook = mongoose.model('BorrowedBook', borrowedBookSchema);

module.exports = BorrowedBook;
  

  
  