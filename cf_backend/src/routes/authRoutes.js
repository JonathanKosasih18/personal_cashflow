const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update/:id', authController.updateUser);
router.delete('/delete/:id', authController.deleteAccount);

module.exports = router;