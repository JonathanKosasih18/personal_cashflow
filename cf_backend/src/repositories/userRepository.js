const db = require("../config/db");

const registerUser = async (username, email, passwordHash) => {
    try {
        const result = await db.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email", 
            [username, email, passwordHash]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error;
    }
};

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

/*
const loginUser = async (email, password) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        const compare = await bcrypt.compare(password, result.rows[0].password_hash);
        if (!compare){
            return null;
        }
        else {
            return result.rows[0];
        }
    } catch (error) {
        console.error("User repository error", error);
    }
};
*/

module.exports = {
    registerUser,
    // loginUser
    getUserByEmail,
};