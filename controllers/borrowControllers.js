const BorrowedBook = require('../models/borrowModel');
const Book = require('../models/bookModel');
const mongoose = require('mongoose');
const User = require('../models/userModel');

// Controller function to handle borrowing a book
const borrowBook = async (req, res) => {
    try {
         // Extract necessary data from the request body and user information
        const { bookId, quantity} = req.body;
        const userId = req.user._id;  

         // Find the book in the database by ID
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Check if there are available stocks for borrowing
        if (book.stocks < quantity) {
            return res.status(400).json({ error: 'Not enough stocks available for borrowing' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user is an admin, admins are not allowed to borrow books
        if (user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized: Administrators are not allowed to borrow books' });
        }

        // Create a new borrowed book entry in the database
        const borrowedBook = await BorrowedBook.create({
            user: userId,
            userName: user.name,
            book: bookId,
            quantity: quantity,
        });

        // Decrease the book stocks 
        await Book.findByIdAndUpdate(bookId, { $inc: { stocks: -quantity } }); 

        // Fetch the updated book information after borrowing
        const updatedBook = await Book.findById(bookId);

        res.status(201).json({
            borrowedBook,
            remainingStocks: updatedBook.stocks,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};

// Controller function to get all borrowed books
const getAllBorrowedBooks = async (req, res) => {
    try {
        // Retrieve the user making the request
        const user = req.user;

        // Check if the user is an admin
        if (user.isAdmin) {
        
        // Fetching all borrowed books with details of the associated book and user, sorted by creation date in descending order
        const borrowedBooks = await BorrowedBook.find({}).select('-createdAt -updateAt -__v');

         // Check if there are no borrowed books and respond accordingly
        if (!borrowedBooks || borrowedBooks.length === 0) {
            return res.status(404).json({ message: 'No borrowed books found' });
        }
        return res.status(200).json(borrowedBooks);
    } else {
        return res.status(403).json({ message: 'Unauthorized: Only administrators can view all borrowed books' });
    }
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};

const getSpecificBorrowedBook = async (req, res) => {
    try {
        // Extract borrow ID from the request parameters
        const { borrowId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(borrowId)) {
            return res.status(400).json({ error: 'Invalid Borrow ID' });
        }

        // Find the specific borrowed book by ID and populate the 'book' and 'user' fields
        const specificBorrowedBook = await BorrowedBook.findById(borrowId)
            .populate('book')
            .populate('user');

        if (!specificBorrowedBook) {
            return res.status(404).json({ error: 'Borrowed book not found' });
        }
        
        res.status(200).json({
            _id: specificBorrowedBook._id,
            user: {
                _id: specificBorrowedBook.user._id,
                name: specificBorrowedBook.user.name
            },
            book: {
                _id: specificBorrowedBook.book._id,
                title: specificBorrowedBook.book.title,
            },
            borrowDate: specificBorrowedBook.borrowDate,
            returnDate: specificBorrowedBook.returnDate,
            returned: specificBorrowedBook.returned,
            createdAt: specificBorrowedBook.createdAt,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};


// Controller function to handle returning a borrowed book
const returnBook = async (req, res) => {
    try {
        // Extract borrow ID from the request parameters
        const { borrowId  } = req.params;
        const { quantity } = req.body;

        // Check if the quantity is a whole number
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid quantity. Only whole numbers are allowed.' });
        }

        if (!mongoose.Types.ObjectId.isValid(borrowId)) {
            return res.status(400).json({ error: 'Invalid Borrow ID' });
        }

        // Find the borrowed book by ID
        const borrowedBook = await BorrowedBook.findById(borrowId);
        if (!borrowedBook) {
            return res.status(404).json({ error: 'Borrowed book not found' });
        }

        // Check if the book has already been returned
        if (borrowedBook.returned) {
            return res.status(400).json({ error: 'Book already returned' });
        }

        // Check if the user is an admin, admins are not allowed to return books
        const user = req.user;
        if (user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized: Administrators are not allowed to return books' });
        }

        if ( quantity > borrowedBook.quantity ) {
            return res.status(400).json({ error: 'Only the exact quantity can be returned' });
        }

         // Mark the borrowed book as returned in the database
         await BorrowedBook.findByIdAndUpdate(borrowId, { $inc: { quantity: -quantity } });

         // Increase the book stocks after returning
         await Book.findByIdAndUpdate(borrowedBook.book, { $inc: { stocks: +quantity } });
 
         // Fetch the updated book information after returning
         const updatedBook = await Book.findById(borrowedBook.book); 

        if (borrowedBook.quantity === quantity) {
            return res.status(200).json({ 
                message: 'Book returned successfully',
                returnDate: borrowedBook.returnDate,
                remainingStocks: updatedBook.stocks,
                returnedQuantity: quantity,
                status: 'All books have been returned'
             });
        }

        return res.status(200).json({
            message: 'Book returned successfully',
            returnDate: borrowedBook.returnDate,
            remainingStocks: updatedBook.stocks,
            returnedQuantity: quantity,
            status: 'Partial books have been returned'
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};

module.exports = { borrowBook, getAllBorrowedBooks, getSpecificBorrowedBook,returnBook };
