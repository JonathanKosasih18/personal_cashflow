const userRepository = require('../repositories/userRepository');
const baseResponse = require('../utils/baseResponse');
const bcrypt = require('bcrypt');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^(?=.*[^\s]{8,})(?=.*\d)(?=.*[^\w\d]).+$/;
const saltRounds = 10;

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return baseResponse(res, false, 400, 'Username, email, and password are required');
    }

    try {
        if (!emailRegex.test(email)) {
            return baseResponse(res, false, 400, 'Invalid email');
        }

        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return baseResponse(res, false, 400, 'Email already registered');
        }

        if (!passRegex.test(password)) {
            return baseResponse(res, false, 400, "Password must be at least 8 chars, contain a number and a special char", null);
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await userRepository.registerUser(username, email, hashedPassword);
        return baseResponse(res, true, 201, 'User registered successfully', newUser);
    } catch (error) {
        return baseResponse(res, false, 500, 'Server error');
    }
};

module.exports = {
    register,
};