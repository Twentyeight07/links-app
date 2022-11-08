const { createPool } = require('mysql2/promise');
const {
  DB_PORT,
  DB_HOST,
  DB_PASSWORD,
  DB_DATABASE,
  DB_USER,
} = require('./config.js');

const pool = createPool({
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE,
});

module.exports = { pool };
