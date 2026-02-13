import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "practice_db",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5,
});

export default pool;

