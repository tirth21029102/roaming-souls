import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
export const pool = mysql
  .createPool({
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
    ssl: {
      rejectUnauthorized: false,
    },
    connectionLimit: 3,
    waitForConnections: true,
  })
  .promise();
