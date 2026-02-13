const userRepository = require('../repositories/userRepository');
const baseResponse = require('../utils/baseResponseUtils');
const generateToken = require('../utils/jwtUtils');
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

        const token = generateToken(newUser.id);

        return baseResponse(res, true, 201, 'User registered successfully', { user: newUser, token });
    } catch (error) {
        return baseResponse(res, false, 500, 'Server error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return baseResponse(res, false, 400, 'Email and password are required');
    }

    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 401, 'Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return baseResponse(res, false, 401, 'Invalid email or password');
        }

        const keysToRemove = ['password_hash', 'created_at'];
        keysToRemove.forEach(key => delete user[key]);

        const token = generateToken(user.id);

        return baseResponse(res, true, 200, 'Login successful', { user, token });
    } catch (error) {
        return baseResponse(res, false, 500, 'Server error');
    }
};

const updateUser = async (req, res) => {
    const id = req.user.id;
    const { username, email } = req.body;

    if (!username || !email) {
        return baseResponse(res, false, 400, 'Username and email are required');
    }

    try {
        const userToUpdate = await userRepository.getUserById(id);
        if (!userToUpdate) {
            return baseResponse(res, false, 404, 'User not found');
        }

        if (!emailRegex.test(email)) {
            return baseResponse(res, false, 400, 'Invalid email format');
        }

        if (email !== userToUpdate.email) {
            const existingUser = await userRepository.getUserByEmail(email);
            if (existingUser) {
                return baseResponse(res, false, 400, 'Email already in use by another account');
            }
        }

        const updatedUser = await userRepository.updateUser(id, username, email);
        return baseResponse(res, true, 200, 'User updated successfully', updatedUser);

    } catch (error) {
        return baseResponse(res, false, 500, 'Server error', error.message);
    }
};

const deleteAccount = async (req, res) => {
    const id = req.user.id;

    try {
        const deletedUser = await userRepository.deleteUser(id);
        
        if (!deletedUser) {
            return baseResponse(res, false, 404, 'User not found');
        }

        return baseResponse(res, true, 200, 'User deleted successfully');
    } catch (error) {
        return baseResponse(res, false, 500, 'Server error', error.message);
    }
};

module.exports = {
    register,
    login,
    updateUser,
    deleteAccount,
};