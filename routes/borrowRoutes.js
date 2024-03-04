const router = require('express').Router();

// Import the authentication middleware for route protection
const verify = require('../middleware/authMiddleware');

// Import borrow controller functions
const { borrowBook, getAllBorrowedBooks, getSpecificBorrowedBook, returnBook } = require('../controllers/borrowControllers');

router.route('/borrow').post(verify, borrowBook);
router.route('/').get(verify, getAllBorrowedBooks);
router.route('/return/:borrowId').put(verify, returnBook); 
router.get('/:borrowId', verify, getSpecificBorrowedBook);

module.exports = router;
