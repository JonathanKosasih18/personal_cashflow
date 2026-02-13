const db = require("../config/db");

const getCategoriesByUserId = async (userId) => {
    try {
        const result = await db.query(
            "SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC",
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error("Category repository error", error);
        throw error;
    }   
};

const createCategory = async (userId, name, direction, color) => {
    try {
        const result = await db.query(
            "INSERT INTO categories (user_id, name, direction, color) VALUES ($1, $2, $3, $4) RETURNING name, direction, color, created_at",
            [userId, name, direction, color]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Category repository error", error);
        throw error;
    }
};

const updateCategory = async (id, name, color) => {
    try {
        const result = await db.query(
            "UPDATE categories SET name = $1, color = $2 WHERE id = $3 RETURNING name, direction, color",
            [name, color, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Category repository error", error);
        throw error;
    }   
};

const deleteCategory = async (id) => {
    try {
        const result = await db.query(
            "DELETE FROM categories WHERE id = $1 RETURNING name, direction, color", 
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Category repository error", error);
        throw error;
    }   
};

module.exports = {
    getCategoriesByUserId,
    createCategory,
    updateCategory,
    deleteCategory
};