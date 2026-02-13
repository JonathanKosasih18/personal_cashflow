const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', protect, authController.updateUser); 
router.delete('/delete', protect, authController.deleteAccount);

module.exports = router;