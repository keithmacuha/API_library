const router = require('express').Router();

// Import the authentication middleware for route protection
const verify = require('../middleware/authMiddleware');

// Import book controller functions
const { getAllBooks, getSpecificBook, createBook, updateBook, deleteBook  } = require('../controllers/bookControllers');

router.route('/').get(getAllBooks).post(verify, createBook);
router.route('/:id').put(updateBook).delete(deleteBook);
router.get('/get/:book_id', getSpecificBook);

module.exports = router;

