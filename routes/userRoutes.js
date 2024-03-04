const router = require('express').Router();

const verify = require('../middleware/authMiddleware');

// Import user controller functions
const { createUser, loginUser, logoutUser, getAllUserProfiles, getUserProfile, deleteUser, updateUser} = require('../controllers/userControllers')

router.post('/create', verify, createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/all', getAllUserProfiles);
router.get('/profile', verify, getUserProfile); 
router.route('/profile/:id').delete( deleteUser).put(updateUser);

module.exports = router;
