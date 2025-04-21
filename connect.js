import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "amathia",
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;