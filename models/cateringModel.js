import { ensureTable, pool } from "./db.js";

const CATERING_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS caterings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  event_date DATE,
  event_type VARCHAR(255),
  guests INT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

export async function initCateringTable() {
    await ensureTable(CATERING_TABLE_SQL);
}

export async function createCatering({ name, email, phone, event_date, event_type, guests, message }) {
    const [res] = await pool.query(
        "INSERT INTO caterings (name, email, phone, event_date, event_type, guests, message) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name || null, email || null, phone || null, event_date || null, event_type || null, guests || null, message || null]
    );
    return { id: res.insertId };
}

export async function getAllCaterings() {
    const [rows] = await pool.query("SELECT * FROM caterings ORDER BY created_at DESC");
    return rows;
}

export async function getCateringById(id) {
    const [rows] = await pool.query("SELECT * FROM caterings WHERE id = ?", [id]);
    return rows[0] || null;
}

export async function updateCateringById(id, { name, email, phone, event_date, event_type, guests, message }) {
    const [res] = await pool.query(
        "UPDATE caterings SET name = ?, email = ?, phone = ?, event_date = ?, event_type = ?, guests = ?, message = ? WHERE id = ?",
        [name || null, email || null, phone || null, event_date || null, event_type || null, guests || null, message || null, id]
    );
    return res.affectedRows > 0;
}

export async function deleteCateringById(id) {
    const [res] = await pool.query("DELETE FROM caterings WHERE id = ?", [id]);
    return res.affectedRows > 0;
}
