const db = require("../config/db");
const { get } = require("../routes/authRoutes");
const bcrypt = require('bcrypt');

const getUserByEmail = async (email) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error;
    }
};

const getUserById = async (id) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error;
    }
};

const registerUser = async (username, email, passwordHash) => {
    try {
        const result = await db.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING username, email", 
            [username, email, passwordHash]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error;
    }
};



module.exports = {
    getUserByEmail,
    getUserById,
    registerUser,
};