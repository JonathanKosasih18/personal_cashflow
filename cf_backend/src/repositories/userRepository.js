const db = require("../config/db");
const { get } = require("../routes/authRoutes");

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

const registerUser = async (username, email, password) => {
    try {
        const result = await db.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING username, email, created_at", 
            [username, email, password]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error;
    }
};

const updateUser = async (id, username, email) => {
    try {
        const result = await db.query(
            "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING username, email",
            [username, email, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const result = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING username, email",
            [id]
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
    updateUser,
    deleteUser,
};