// Import necessary modules
const Book = require('../models/bookModel');
const mongoose = require('mongoose');

// Controller function to get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({}).sort({ createdAt: -1 });;

        if (!books) {
            return res.status(400).json({ message: 'No existing books' });
        }

        return res.status(200).json(books);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};

// Controller function to get a specific book by ID
const getSpecificBook = async (req, res) => {
    try {
        const { book_id} = req.params;

        const user_books = await Book.find({ _id: book_id });

        if (!user_books || user_books.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.json(user_books);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
}

// Controller function to create a new book
const createBook = async (req, res) => {
    try {
        // Extract book details from the request body
        const { title, author, genre, stocks } = req.body;

        const user = req.user;

        if (!user.isAdmin) {
            return res.status(401).json({ error: 'Unauthorized. Only admins can create books' });
        }
 
        // Check if the requesting user is an admin
        if (user.isAdmin == true) {

            // Check if the book with the provided title and author already exists
            const bookExists = await Book.findOne({ title: title, author: author });

            if (bookExists) {
                return res.status(409).json({ error: 'Book already exists' });
            };
    
             // Create a new book in the database
            const book = await Book.create({
                title: title,
                author: author,
                genre: genre,
                stocks: stocks
            });
    
            // Respond with the details of the created book
            if (book) {
                return res.status(201).json({
                    _id: book._id,
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    stocks: book.stocks
                })
            } 
        }
        else {
            // Respond with an unauthorized error if the user is not an admin
            return res.status(401).json({ error: 'Unauthorized'});
        }
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: error.message,
            stack: error.stack
        });
    }
}

// Controller function to update a book by ID
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    // Find and update the book by ID with the provided data
    const updatedBook = await Book.findOneAndUpdate(
        {_id: id}, 
        {...req.body}, 
        {new: true });

    if (!updatedBook) {
        return res.status(400).json({ error: 'Book not found' });
    }
    return res.status(200).json(updatedBook);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};

// Controller function to delete a book by ID
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid book ID' });
        }

         // Find and delete the book by ID
        const deletedBook = await Book.findOneAndDelete({_id: id});

        // Successful book deletion
        if (!deletedBook) {
            return res.status(400).json({error: 'Book not found'});
        }

        return res.status(200).json({message: 'Book Deleted Successfully'});

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        })
    }   
}

// Export all the book controller functions
module.exports = { getAllBooks, getSpecificBook, createBook, updateBook, deleteBook };

