const { Pool } = require('pg');
const config = require('../config/database');

const pool = new Pool(config);

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(-1);
  } else {
    console.log('Connected to PostgreSQL database');
    release(); // libera a conexão
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};