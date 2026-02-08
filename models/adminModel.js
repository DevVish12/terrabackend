import { pool } from "./db.js";

export async function createAdmin({ email, name, passwordHash }) {
    const sql = "INSERT INTO admins (email, name, password_hash) VALUES (?, ?, ?)";
    const params = [email, name || null, passwordHash];
    const [result] = await pool.query(sql, params);
    return { id: result.insertId, email, name };
}

export async function findAdminByEmail(email) {
    const sql = "SELECT id, email, name, password_hash FROM admins WHERE email = ? LIMIT 1";
    const [rows] = await pool.query(sql, [email]);
    return rows[0] || null;
}
