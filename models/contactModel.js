import { pool } from "./db.js";

export async function createContact({ name, email, phone, message }) {
    const sql = "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";
    const params = [name || null, email || null, phone || null, message || null];
    const [result] = await pool.query(sql, params);
    return { id: result.insertId };
}

export async function getAllContacts() {
    const [rows] = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
    return rows;
}

export async function getContactById(id) {
    const [rows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [id]);
    return rows[0] || null;
}

export async function deleteContactById(id) {
    const [result] = await pool.query("DELETE FROM contacts WHERE id = ?", [id]);
    return result.affectedRows > 0;
}
