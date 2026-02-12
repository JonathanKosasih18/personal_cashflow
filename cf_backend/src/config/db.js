const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 5, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 5000 
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error acquiring client', err.stack);
    }
    console.log('✅ Connected to Neon Database successfully');
    release();
});

module.exports = pool;