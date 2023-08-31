import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM USERS');
    return rows;
};

export async function getUser(id) {
    const [rows] = await pool.query('SELECT * FROM USERS WHERE id = ?', [id]);
    return rows[0];
};

export async function createUser(first_name, last_name, email, username, password) {
    const [rows] = await pool.query(`
    INSERT INTO USERS(first_name, last_name, email, username, password)
    VALUES(?, ?, ?, ?, ?)
    `, [first_name, last_name, email, username, password]);
    const id = rows.insertId;
    console.log('Usuário criado com sucesso!')
    return getUser(id);
};